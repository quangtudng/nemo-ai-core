/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from "@nestjs/common";
import { BaseCrudService } from "@core/utils/crud/base-service";
import { Customer } from "./index.entity";
import { CustomerRepository } from "./index.repository";
import { generate } from "randomstring";
import { CONVERSATION_STAGE } from "@app/message/constants/conversation";

@Injectable()
export class CustomerService extends BaseCrudService<Customer> {
  constructor(private repo: CustomerRepository) {
    super(repo);
  }
  async createNewCustomer() {
    const longId = generate({
      length: 100,
      charset: "alphanumeric",
    });
    // TODO: Ip and location saving
    return this.createOne({
      longId,
      email: null,
      ip: null,
      location: "Default location",
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
    return customers.map((customer: any) => ({
      id: customer.id,
      long_id: customer.long_id,
      email: customer.email,
      location: customer.location,
      viewed: customer.viewed,
      first_contacted: customer.first_contacted,
      last_contacted: customer.message_created_at,
      last_message: {
        id: customer.message_id,
        owner: customer.message_owner,
        body: customer.message_body,
        created_at: customer.message_created_at,
      },
    }));
  }
}
