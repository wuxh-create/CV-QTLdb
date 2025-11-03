export default defineI18nLocale(async locale => {
  return {
    Navigation: {
      Title: "健康报告",
      Home: "主页",
      Upload: "上传信息",
      Result: "查询结果",
      About: "说明",
      Footer: "版权所有 © 2024 The Gong Lab. 保留所有权利",
    },
    Index: {
      Landing: {
        Title: "未病先防，健康先行",
        Subtitle:
          "只需上传遗传变异信息，即可为您估计患病风险，生成个性化健康报告",
        Buttonlabel: "解析我的变异",
      },
      Features: {
        Feature1: {
          Title: "精准定位",
          Description: "利用多个遗传变异位点信息，精准定位潜在的风险疾病",
        },
        Feature2: {
          Title: "私人订制",
          Description: "每份报告都是根据您的遗传信息生成，内容独一无二，专属于您",
        },
        Feature3: {
          Title: "用户友好",
          Description: "直观的用户界面和简便的操作流程让您可以轻松上手",
        },
        Feature4: {
          Title: "专业支持",
          Description:
            "我们提供多种健康服务，包括疾病风险评估、健康建议、营养指导等，满足您的多样需求",
        },
        Feature5: {
          Title: "隐私安全",
          Description: "采用了可靠的数据加密技术，确保您的个人隐私得到严格保护",
        },
        Feature6: {
          Title: "持续更新",
          Description:
            "紧跟科学发展步伐，定期更新分析模型和健康建议，确保您始终获得最前沿的健康信息",
        },
      },
    },
    Upload: {
      Step1: {
        Step: {
          Title: "上传遗传变异信息",
          Caption: "文件需小于{maxSize}",
          NextStepButtonLabel: "下一步",
          ResetButtonLabel: "重置",
        },
        Content: {
          Title: "上传VCF文件",
          Description: "文件需小于{maxSize}",
          InputTint: "选择文件或将文件拖入此处",
          Messages: {
            Success: "上传成功: {infos}",
            ErrorFiletype: "文件类型不符合要求",
            ErrorFilesize: "文件大小超出限制",
            ErrorOther: "其他错误: {infos}",
          },
        },
      },
      Step2: {
        Step: {
          Title: "设置分析参数",
          Caption: "可选",
          SubmitButtonLabel: "提交",
          BackButtonLabel: "上一步",
        },
        Content: {
          SampleNameLabel: "样本名",
          SampleNamePlaceholder: "VCF中要分析的样本名",
          SampleRuleMessage: "样本中不能含有除-和_之外的特殊字符",
          SampleNameTint: "留空则使用第一个样本",
          SampleNameWarning: "未指定样本名，将使用第一个样本的信息",
          SampleNameUnspecified: "未指定",
          GenderLabel: "性别",
          GenderMale: "男",
          GenderFemale: "女",
        },
        Agreement: {
          AgreementStatement: "我已充分阅读且同意 ",
          AgreementName: "用户协议与隐私政策",
          AgreementTitle: "用户协议与隐私政策",
          AgreementContent: "123213123",
          AgreementAccept: "接受",
          AgreementRegect: "拒绝",
          AgreementWarning: "必须同意用户协议与隐私政策才能进行分析",
        },
      },
      Step3: {
        DialogBody: {
          Title: "确认输入信息",
          ConfirmButton: "确认",
          CancelButton: "取消",
        },
        FileInfo: {
          Title: "文件信息",
          FileName: "文件名",
          FileSize: "文件大小",
        },
        RunArgs: {
          Title: "运行参数",
          SampleName: "样本名",
          Gender: "性别",
        },
        Uploading: {
          Message: "正在创建任务，请稍候",
        },
      },
    },
    Result: {
      Token: {
        Title: "您的Token已生成",
        Description:
          "使用该Token可以在24小时内查看您的结果，可点击下方按钮复制Token，或直接查看结果",
        CopyBtnLabel: "复制代码",
        GetResultBtnLabel: "查看结果",
        CopyFailedMessage: "复制代码时出现错误",
      },
      Messages: {
        WarnFileLines:
          "File line exceeds limit, taking the first {maxLines} lines",
        WarnSampleUnspecified:
          "Sample name not specified, using the first sample",
      },
    },
  }
});
