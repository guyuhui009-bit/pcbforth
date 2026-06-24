/**
 * CRM tRPC router tests
 * Tests the public submitRfq procedure and admin CRUD operations.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";
import type { IncomingMessage, ServerResponse } from "http";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function makePublicCtx() {
  const req = { headers: {}, cookies: {} } as unknown as IncomingMessage;
  const res = {} as ServerResponse;
  return createContext({ req, res });
}

function makeAdminCtx() {
  const req = {
    headers: {},
    cookies: {},
  } as unknown as IncomingMessage;
  const res = {} as ServerResponse;
  const ctx = createContext({ req, res });
  // Inject a mock admin user
  return {
    ...ctx,
    user: {
      id: 1,
      openId: "test-admin",
      name: "Test Admin",
      email: "admin@test.com",
      role: "admin" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

describe("CRM - submitRfq (public)", () => {
  it("should accept a valid standard_quote RFQ", async () => {
    const ctx = await makePublicCtx();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.crm.submitRfq({
      rfqType: "standard_quote",
      contactEmail: "buyer@example.com",
      contactName: "John Buyer",
      companyName: "Test Corp",
      pcbType: "pcb",
      layers: 4,
      quantity: 100,
      boardWidth: 100,
      boardHeight: 80,
      notes: "Test RFQ from vitest",
    });

    expect(result).toHaveProperty("rfqId");
    expect(typeof result.rfqId).toBe("number");
    expect(result.rfqId).toBeGreaterThan(0);
  });

  it("should accept a free_sample RFQ", async () => {
    const ctx = await makePublicCtx();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.crm.submitRfq({
      rfqType: "free_sample",
      contactEmail: "sample@example.com",
      contactName: "Jane Tester",
      companyName: "Sample Co",
      pcbType: "pcb",
      layers: 2,
      quantity: 5,
    });

    expect(result).toHaveProperty("rfqId");
    expect(typeof result.rfqId).toBe("number");
  });

  it("should reject RFQ with missing required email", async () => {
    const ctx = await makePublicCtx();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.crm.submitRfq({
        rfqType: "standard_quote",
        contactEmail: "", // empty email should fail zod validation
        contactName: "No Email",
      } as any)
    ).rejects.toThrow();
  });
});

describe("CRM - customers (admin)", () => {
  it("should list customers for admin", async () => {
    const ctx = await makeAdminCtx();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.crm.customers.list({});

    expect(result).toHaveProperty("items");
    expect(result).toHaveProperty("total");
    expect(Array.isArray(result.items)).toBe(true);
  });

  it("should return stats for admin", async () => {
    const ctx = await makeAdminCtx();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.crm.stats();

    expect(result).toHaveProperty("customers");
    expect(result).toHaveProperty("leads");
    expect(result).toHaveProperty("rfqs");
    expect(result).toHaveProperty("projects");
    expect(result).toHaveProperty("invoices");
  });
});

describe("CRM - rfqs (admin)", () => {
  it("should list RFQs for admin", async () => {
    const ctx = await makeAdminCtx();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.crm.rfqs.list({});

    expect(result).toHaveProperty("items");
    expect(result).toHaveProperty("total");
    expect(Array.isArray(result.items)).toBe(true);
  });
});

describe("CRM - leads (admin)", () => {
  it("should list leads for admin", async () => {
    const ctx = await makeAdminCtx();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.crm.leads.list({});

    expect(result).toHaveProperty("items");
    expect(result).toHaveProperty("total");
    expect(Array.isArray(result.items)).toBe(true);
  });
});

describe("CRM - projects (admin)", () => {
  it("should list projects for admin", async () => {
    const ctx = await makeAdminCtx();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.crm.projects.list({});

    expect(result).toHaveProperty("items");
    expect(result).toHaveProperty("total");
    expect(Array.isArray(result.items)).toBe(true);
  });
});

describe("CRM - invoices (admin)", () => {
  it("should list invoices for admin", async () => {
    const ctx = await makeAdminCtx();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.crm.invoices.list({});

    expect(result).toHaveProperty("items");
    expect(result).toHaveProperty("total");
    expect(Array.isArray(result.items)).toBe(true);
  });
});
