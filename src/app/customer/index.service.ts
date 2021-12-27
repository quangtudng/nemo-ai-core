/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from "@nestjs/common";
import { BaseCrudService } from "@core/utils/crud/base-service";
import { Customer } from "./index.entity";
import { CustomerRepository } from "./index.repository";
import { generate } from "randomstring";
import { DeepPartial } from "typeorm";

@Injectable()
export class CustomerService extends BaseCrudService<Customer> {
  constructor(private repo: CustomerRepository) {
    super(repo);
  }

  async createNewCustomer(dto: DeepPartial<Customer>) {
    const longId = generate({
      length: 100,
      charset: "alphanumeric",
    });
    return this.createOne({
      longId,
      email: null,
      ip: dto.ip || null,
      location: "Default location",
      viewed: 0,
      currentStage: "STARTED_CONVERSATION",
      passStages: "['STARTED_CONVERSATION']",
    });
  }

  async getAllCustomerAndMessage() {
    const sql = `SELECT c.id,
                        c.email,
                        c.location,
                        c.viewed,
                        c.long_id,
                        p1.id AS message_id,
                        p1.owner AS message_owner,
                        p1.body AS message_body,
                        p1.created_at AS message_created_at
                    FROM customers c
                    JOIN messages p1 ON (c.id = p1.customer_id)
                    LEFT OUTER JOIN messages p2 ON (c.id = p2.customer_id
                                                AND (p1.created_at < p2.created_at
                                                      OR (p1.created_at = p2.created_at
                                                          AND p1.id < p2.id)))
                    WHERE p2.id IS NULL
                    ORDER BY message_created_at DESC;`;
    const customers = await this.repo.query(sql);
    return customers.map((customer) => ({
      id: customer.id,
      long_id: customer.long_id,
      email: customer.email,
      location: customer.location,
      viewed: customer.viewed,
      last_message: {
        id: customer.message_id,
        owner: customer.message_owner,
        body: customer.message_body,
        created_at: customer.message_created_at,
      },
    }));
  }
}
