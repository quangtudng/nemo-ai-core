/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from "@nestjs/common";
import { BaseCrudService } from "@core/utils/crud/base-service";
import { Customer } from "./index.entity";
import { CustomerRepository } from "./index.repository";
import { generate } from "randomstring";
import { CONVERSATION_STAGE } from "@app/message/constants/conversation";
import { ProjectLogger } from "@core/utils/loggers/log-service";
import { ServiceService } from "@app/service/index.service";
import { Service } from "@app/service/index.entity";

@Injectable()
export class CustomerService extends BaseCrudService<Customer> {
  constructor(
    private repo: CustomerRepository,
    private serviceService: ServiceService,
  ) {
    super(repo);
  }
  async createNewCustomer() {
    const longId = generate({
      length: 40,
      charset: "alphanumeric",
    });
    return this.createOne({
      longId,
      email: null,
      ip: null,
      location: "Việt Nam",
      viewed: 0,
      currentStage: CONVERSATION_STAGE.INTRODUCTION,
    });
  }

  async getAllCustomerAndMessage() {
    // This is the common greatest n per groups problems
    const sql = `SELECT c.id,
                        c.email,
                        c.location,
                        c.viewed,
                        c.long_id,
                        c.created_at AS first_contacted,
                        c.selected_interests,
                        m1.id AS message_id,
                        m1.owner AS message_owner,
                        m1.body AS message_body,
                        m1.created_at AS message_created_at
                    FROM customers c
                    JOIN messages m1 ON (c.id = m1.customer_id)
                    LEFT OUTER JOIN messages m2 ON (c.id = m2.customer_id
                                                AND (m1.created_at < m2.created_at
                                                      OR (m1.created_at = m2.created_at
                                                          AND m1.id < m2.id)))
                    WHERE m2.id IS NULL
                    ORDER BY message_created_at DESC;`;
    const customers = await this.repo.query(sql);
    for (let i = 0; i < customers.length; i++) {
      const customer = customers[i];
      // Get customer interests
      const selectedInterests = this._parseInterestResults(
        customer.selected_interests,
      );
      if (selectedInterests?.length > 0) {
        customer.selectedInterests =
          await this.serviceService.findServicesByIds(selectedInterests);
        customer.selectedInterests = customer.selectedInterests.map(
          (interest: Service) => ({
            id: interest.id,
            title: interest.title,
            location: interest.location.name,
            category: interest.category.title,
          }),
        );
      } else {
        customer.selectedInterests = [];
      }
    }

    return customers.map((customer: any) => ({
      id: customer.id,
      long_id: customer.long_id,
      email: customer.email,
      viewed: customer.viewed,
      first_contacted: customer.first_contacted,
      last_contacted: customer.message_created_at,
      interests: customer.selectedInterests,
      last_message: {
        id: customer.message_id,
        owner: customer.message_owner,
        body: customer.message_body,
      },
    }));
  }

  async saveCustomerInterests(customerLongId: string, interestId: number) {
    try {
      const customer = await this.repo.findOneOrFail({
        longId: customerLongId,
      });
      if (customer.selectedInterests) {
        let interests = this._parseInterestResults(customer.selectedInterests);
        // Add new service interest id
        interests.push(interestId);
        interests = [...new Set(interests)];
        customer.selectedInterests = JSON.stringify(interests);
      } else {
        customer.selectedInterests = JSON.stringify([interestId]);
      }
      return this.repo.save(customer);
    } catch (error) {
      ProjectLogger.exception(error);
      return null;
    }
  }

  private _parseInterestResults(selectedInterests: string) {
    let result = [];
    try {
      if (selectedInterests) {
        result = JSON.parse(selectedInterests);
      }
    } catch (error) {
      ProjectLogger.exception(error.stack);
    }
    return result;
  }
}
