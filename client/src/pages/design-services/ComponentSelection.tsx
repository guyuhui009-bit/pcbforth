import { Package } from "lucide-react";
import { ServicePageLayout } from "./_ServicePageLayout";

export default function ComponentSelection() {
  return (
    <ServicePageLayout
      accentColor="#0891B2"
      accentBg="#E0F7FA"
      icon={<Package size={28} />}
      titleZh="元器件选型"
      titleEn="Component Selection"
      subtitleZh="基于 TI / NXP / ST / Infineon 等主流供应商资源，提供 BOM 优化、替代料推荐、价格谈判及备货建议，帮助您降低物料成本、缩短交期、规避断货风险。"
      subtitleEn="Leveraging TI / NXP / ST / Infineon supplier networks — BOM optimization, alternate component recommendations, pricing negotiation, and inventory planning to reduce material costs, shorten lead times, and mitigate supply chain risks."
      descZh="元器件选型是 PCB 设计中影响成本、交期和可靠性的关键决策。PCBforth 的元器件选型服务由具备丰富供应链经验的工程师执行，我们与 TI、NXP、ST、Infineon、Murata、Yageo 等主流元器件供应商建立了长期合作关系，能够获取最新的价格、货期和技术支持。服务涵盖从初始 BOM 审查、替代料推荐到价格谈判和备货建议的全流程，帮助您在保证设计性能的前提下，最大程度降低物料成本，规避供应链风险。"
      descEn="Component selection is a critical decision in PCB design that impacts cost, lead time, and reliability. PCBforth's component selection service is executed by engineers with extensive supply chain experience. We have established long-term partnerships with TI, NXP, ST, Infineon, Murata, Yageo, and other major component suppliers, enabling access to the latest pricing, lead times, and technical support."
      capabilitiesZh={[
        "BOM 完整性审查",
        "替代料推荐（功能兼容）",
        "国产替代方案（降本）",
        "价格谈判与批量折扣",
        "供货周期评估",
        "断货风险预警",
        "器件生命周期管理",
        "REACH / RoHS 合规检查",
      ]}
      capabilitiesEn={[
        "BOM completeness review",
        "Alternate component recommendations (functional equivalent)",
        "Domestic substitute solutions (cost reduction)",
        "Pricing negotiation & volume discounts",
        "Lead time evaluation",
        "Supply shortage risk alerts",
        "Component lifecycle management",
        "REACH / RoHS compliance check",
      ]}
      specs={[
        { labelZh: "合作供应商", labelEn: "Key Suppliers", value: "TI / NXP / ST / Infineon / Murata / Yageo" },
        { labelZh: "备货品类", labelEn: "Stock SKUs", value: "50,000+ SKUs" },
        { labelZh: "替代料响应", labelEn: "Alt. Response Time", value: "Within 24 hours" },
        { labelZh: "价格优势", labelEn: "Price Advantage", value: "10~30% below market" },
        { labelZh: "交付物", labelEn: "Deliverables", value: "Optimized BOM + Alt. List + Pricing Report" },
        { labelZh: "交付周期", labelEn: "Lead Time", value: "3 ~ 7 business days" },
      ]}
      workflow={[
        {
          titleZh: "BOM 审查与完整性检查",
          titleEn: "BOM Review & Completeness Check",
          descZh: "接收客户 BOM，检查器件型号、封装、数量的完整性和准确性，识别缺失信息（如无 MPN 的器件、封装不明确的器件），输出 BOM 审查报告。",
          descEn: "Receive the client's BOM, check the completeness and accuracy of part numbers, packages, and quantities. Identify missing information (components without MPN, components with unclear packages) and output a BOM review report.",
        },
        {
          titleZh: "价格与货期查询",
          titleEn: "Pricing & Lead Time Inquiry",
          descZh: "向主流分销商（Digi-Key、Mouser、Arrow、AVNET）和原厂询价，获取最新价格和货期信息，对比不同渠道的价格差异，为客户提供最优采购建议。",
          descEn: "Inquire with major distributors (Digi-Key, Mouser, Arrow, AVNET) and manufacturers for the latest pricing and lead time information. Compare price differences across channels and provide optimal procurement recommendations.",
        },
        {
          titleZh: "替代料推荐",
          titleEn: "Alternate Component Recommendations",
          descZh: "针对价格偏高、货期过长或断货风险较高的器件，推荐功能兼容的替代料（包括国产替代方案），提供详细的参数对比表，确保替代料满足设计要求。",
          descEn: "For components with high prices, long lead times, or high shortage risk, recommend functionally compatible alternates (including domestic substitutes). Provide detailed parameter comparison tables to ensure alternates meet design requirements.",
        },
        {
          titleZh: "成本优化与谈判",
          titleEn: "Cost Optimization & Negotiation",
          descZh: "基于项目批量和长期合作关系，与供应商进行价格谈判，争取批量折扣和优先备货权，通常可以将 BOM 总成本降低 10%~30%。",
          descEn: "Based on project volume and long-term partnerships, negotiate pricing with suppliers to secure volume discounts and priority inventory allocation, typically reducing total BOM cost by 10%~30%.",
        },
        {
          titleZh: "交付优化 BOM",
          titleEn: "Deliver Optimized BOM",
          descZh: "交付完整的优化 BOM，包含推荐器件型号、替代料清单、价格对比表、货期信息和采购建议，并提供 REACH/RoHS 合规声明。",
          descEn: "Deliver a complete optimized BOM including recommended part numbers, alternate component list, price comparison table, lead time information, procurement recommendations, and REACH/RoHS compliance declarations.",
        },
      ]}
      faqZh={[
        {
          q: "你们能处理多大规模的 BOM？",
          a: "我们可以处理从几十个器件到数千个器件的 BOM，没有规模限制。对于大型 BOM，我们会优先处理高价值、长货期和高风险器件。",
        },
        {
          q: "国产替代方案的质量可靠吗？",
          a: "我们推荐的国产替代方案均来自经过认证的供应商，并提供详细的参数对比表。对于关键器件，我们会建议客户进行样品验证测试后再批量采购。",
        },
        {
          q: "元器件选型服务可以和原理图设计一起进行吗？",
          a: "可以，我们建议在原理图设计阶段同步进行元器件选型，这样可以在设计阶段就考虑器件的可获得性和成本，避免后期因器件断货或价格过高而需要重新设计。",
        },
      ]}
      faqEn={[
        {
          q: "What size BOM can you handle?",
          a: "We can handle BOMs ranging from dozens to thousands of components with no size limit. For large BOMs, we prioritize high-value, long lead-time, and high-risk components.",
        },
        {
          q: "Are domestic substitute components reliable?",
          a: "All domestic substitutes we recommend come from certified suppliers, and we provide detailed parameter comparison tables. For critical components, we recommend sample validation testing before mass procurement.",
        },
        {
          q: "Can component selection be done alongside schematic design?",
          a: "Yes, we recommend synchronizing component selection with schematic design. This allows component availability and cost to be considered at the design stage, avoiding redesign due to component shortages or high prices later.",
        },
      ]}
    />
  );
}
