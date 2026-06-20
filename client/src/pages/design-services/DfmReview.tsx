import { CheckCircle } from "lucide-react";
import { ServicePageLayout } from "./_ServicePageLayout";

export default function DfmReview() {
  return (
    <ServicePageLayout
      accentColor="#059669"
      accentBg="#ECFDF5"
      icon={<CheckCircle size={28} />}
      titleZh="DFM 审查"
      titleEn="DFM Review"
      subtitleZh="制造可行性分析，识别可能导致生产问题的设计缺陷，提供焊盘尺寸、丝印间距、孔径等优化建议，显著降低首板返工率，加快产品上市速度。"
      subtitleEn="Manufacturing feasibility analysis identifying design defects that cause production issues. Recommendations on pad size, silkscreen, drill, and more — significantly reducing first-pass rework rates and accelerating time-to-market."
      descZh="DFM（Design for Manufacturability，可制造性设计）审查是连接设计与制造的关键环节。许多看似正确的 PCB 设计在实际生产中会遇到各种问题：焊盘间距过小导致桥接、孔径过小导致钻孔困难、丝印与焊盘重叠导致可焊性下降等。PCBforth 的 DFM 审查服务由具备丰富制造经验的工程师执行，结合我们自有制造工厂的实际工艺能力，对设计文件进行全面的可制造性分析，提供具体的优化建议，帮助您在制板前解决所有潜在的制造问题，将首板良率从行业平均的 60%~70% 提升到 90% 以上。"
      descEn="DFM (Design for Manufacturability) review is the critical link between design and manufacturing. Many seemingly correct PCB designs encounter various issues in actual production: pad spacing too small causing bridging, drill sizes too small causing drilling difficulties, silkscreen overlapping pads causing solderability issues. PCBforth's DFM review service is performed by engineers with extensive manufacturing experience, combined with our own manufacturing factory's actual process capabilities."
      capabilitiesZh={[
        "焊盘尺寸与间距检查",
        "最小线宽/间距验证",
        "钻孔尺寸与孔径比检查",
        "丝印与焊盘冲突检测",
        "SMT 工艺可行性分析",
        "BGA 扇出与逃逸路由检查",
        "板边间距与拼板建议",
        "测试点覆盖率分析",
      ]}
      capabilitiesEn={[
        "Pad size & spacing check",
        "Min trace/space verification",
        "Drill size & aspect ratio check",
        "Silkscreen vs pad conflict detection",
        "SMT process feasibility analysis",
        "BGA fanout & escape routing check",
        "Board edge clearance & panelization",
        "Test point coverage analysis",
      ]}
      specs={[
        { labelZh: "审查范围", labelEn: "Review Scope", value: "PCB Design + Gerber + Assembly Drawing" },
        { labelZh: "最小线宽/间距", labelEn: "Min Trace/Space", value: "2mil / 2mil" },
        { labelZh: "最小孔径", labelEn: "Min Drill", value: "0.1mm (laser) / 0.2mm (mechanical)" },
        { labelZh: "孔径比", labelEn: "Aspect Ratio", value: "≤ 10:1 (PTH)" },
        { labelZh: "交付物", labelEn: "Deliverables", value: "DFM Report + Issue List + Fix Recommendations" },
        { labelZh: "交付周期", labelEn: "Lead Time", value: "2 ~ 5 business days" },
      ]}
      workflow={[
        {
          titleZh: "设计文件接收与解析",
          titleEn: "Design File Receipt & Parsing",
          descZh: "接收客户提供的 Gerber 文件、ODB++ 文件或 PCB 源文件，解析各层信息，建立完整的设计数据模型，为后续 DFM 检查提供准确的输入数据。",
          descEn: "Receive Gerber files, ODB++ files, or PCB source files from the client. Parse layer information and build a complete design data model to provide accurate input data for subsequent DFM checks.",
        },
        {
          titleZh: "制造工艺规则检查",
          titleEn: "Manufacturing Process Rule Check",
          descZh: "按照 IPC-2221 和工厂实际工艺能力，检查最小线宽/间距、最小孔径、孔径比、板厚/孔径比等关键制造参数，标注所有超出工艺能力的设计项。",
          descEn: "Check minimum trace/space, minimum drill size, aspect ratio, board thickness/drill ratio, and other key manufacturing parameters per IPC-2221 and actual factory process capabilities. Flag all design items exceeding process capabilities.",
        },
        {
          titleZh: "SMT 组装可行性分析",
          titleEn: "SMT Assembly Feasibility Analysis",
          descZh: "分析 SMT 组装工艺可行性，包括焊盘尺寸与封装匹配、焊盘间距与桥接风险、丝印与焊盘冲突、BGA 焊球间距与钢网开口、测试点可访问性等。",
          descEn: "Analyze SMT assembly feasibility including pad size vs. package matching, pad spacing and bridging risk, silkscreen vs. pad conflicts, BGA ball pitch and stencil aperture, and test point accessibility.",
        },
        {
          titleZh: "拼板与工艺边建议",
          titleEn: "Panelization & Process Edge Recommendations",
          descZh: "根据产品尺寸和生产批量，提供最优拼板方案建议（V-cut / 邮票孔），规划工艺边宽度和定位孔位置，优化生产效率和制造成本。",
          descEn: "Based on product dimensions and production volume, provide optimal panelization recommendations (V-cut / tab routing), plan process edge width and fiducial mark locations to optimize production efficiency and manufacturing cost.",
        },
        {
          titleZh: "报告输出与整改支持",
          titleEn: "Report Output & Fix Support",
          descZh: "输出完整的 DFM 审查报告，包含问题清单（按严重程度分级：致命/严重/建议）、问题位置截图和具体整改建议，并提供整改后的复查服务。",
          descEn: "Output a complete DFM review report including an issue list (graded by severity: critical/major/advisory), issue location screenshots, and specific fix recommendations. Provide re-review service after fixes.",
        },
      ]}
      faqZh={[
        {
          q: "DFM 审查需要提供哪些文件？",
          a: "通常需要提供 Gerber 文件（所有层）或 ODB++ 文件，以及装配图（Assembly Drawing）。如果有 PCB 源文件（Altium/Cadence/KiCad），也可以直接提供，我们会自动生成 Gerber 进行分析。",
        },
        {
          q: "DFM 审查和 DRC 检查有什么区别？",
          a: "DRC（设计规则检查）是 EDA 工具内置的电气规则检查，主要检查电气连接错误。DFM 审查是从制造工艺角度进行的可制造性分析，关注的是设计能否被工厂顺利制造，两者互补，不能相互替代。",
        },
        {
          q: "DFM 审查报告里的问题按什么标准分级？",
          a: "我们按照 IPC 标准将问题分为三级：致命（Critical）— 必须修改，否则无法制造；严重（Major）— 强烈建议修改，否则会影响良率；建议（Advisory）— 可选优化项，修改后可提升制造效率或降低成本。",
        },
      ]}
      faqEn={[
        {
          q: "What files are needed for DFM review?",
          a: "Typically required: Gerber files (all layers) or ODB++ files, plus an Assembly Drawing. PCB source files (Altium/Cadence/KiCad) can also be provided directly — we will automatically generate Gerber for analysis.",
        },
        {
          q: "What is the difference between DFM review and DRC check?",
          a: "DRC (Design Rule Check) is a built-in EDA tool check for electrical rule violations, primarily checking electrical connection errors. DFM review is a manufacturability analysis from the manufacturing process perspective, focusing on whether the design can be smoothly manufactured. They are complementary and cannot replace each other.",
        },
        {
          q: "How are issues in the DFM review report graded?",
          a: "We grade issues into three levels per IPC standards: Critical — must be fixed, otherwise manufacturing is impossible; Major — strongly recommended to fix, otherwise yield will be affected; Advisory — optional optimization items that improve manufacturing efficiency or reduce cost.",
        },
      ]}
    />
  );
}
