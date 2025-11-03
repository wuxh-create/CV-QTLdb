export default defineI18nLocale(async locale => {
  return {
    Navigation: {
      Title: "Health Report",
      Home: "Home",
      Upload: "Upload",
      Result: "Result",
      About: "About",
      Footer: "Copyright © 2024 The Gong Lab. All rights reserved.",
    },
    Index: {
      Landing: {
        Title: "Prevent Pre Disease",
        Subtitle:
          "Upload your genetic info to assess risks and get a personalized health report",
        Buttonlabel: "Analyze my variants",
      },
      Features: {
        Feature1: {
          Title: "Accurate Risk Pinpointing",
          Description: "Identify potential health risks using genetic variants",
        },
        Feature2: {
          Title: "Customized Reports",
          Description: "Reports tailored to your unique genetic profile",
        },
        Feature3: {
          Title: "Easy to Use",
          Description: "Simple interface and straightforward process",
        },
        Feature4: {
          Title: "Comprehensive Services",
          Description:
            "Diverse health services including risk assessment and guidance",
        },
        Feature5: {
          Title: "Secure Privacy",
          Description: "Advanced encryption to safeguard your privacy",
        },
        Feature6: {
          Title: "Regular Updates",
          Description: "Stay current with the latest health insights and models",
        },
      },
    },
    Upload: {
      Step1: {
        Step: {
          Title: "Upload genetic variant data",
          Caption: "Required",
          NextStepButtonLabel: "Next",
          ResetButtonLabel: "Reset",
        },
        Content: {
          Title: "Upload your VCF",
          Description: "Only vcf supported (<{maxSize})",
          InputTint: "Select or drag file here",
          Messages: {
            Success: "Upload success: {infos}",
            ErrorFiletype: "File format error",
            ErrorFilesize: "File size exceeds limit",
            ErrorOther: "Unknown error: {infos}",
          },
        },
      },
      Step2: {
        Step: {
          Title: "Setting args",
          Caption: "Optional",
          SubmitButtonLabel: "Submit",
          BackButtonLabel: "Back",
        },
        Content: {
          SampleNameLabel: "Sample",
          SampleNamePlaceholder: "Sample in VCF to be analyzed",
          SampleRuleMessage:
            "Sample name cannot contain special characters except - and _",
          SampleNameTint: "Leave blank to use the first sample",
          SampleNameWarning:
            "Using the first sample since sample name is unspecified",
          SampleNameUnspecified: "None",
          GenderLabel: "Gender",
          GenderMale: "Male",
          GenderFemale: "Female",
        },
        Agreement: {
          AgreementStatement: "I have read and agree to the ",
          AgreementName: "Terms and Conditions",
          AgreementTitle: "Terms and Conditions",
          AgreementContent: "12312312",
          AgreementAccept: "Accept",
          AgreementRegect: "Reject",
          AgreementWarning:
            "You must agree to the terms and conditions to perform the analysis",
        },
      },
      Step3: {
        DialogBody: {
          Title: "Confirm Input Information",
          ConfirmButton: "Confirm",
          CancelButton: "Cancel",
        },
        FileInfo: {
          Title: "File Information",
          FileName: "Name",
          FileSize: "Size",
        },
        RunArgs: {
          Title: "Arguments",
          SampleName: "Sample",
          Gender: "Gender",
        },
        Uploading: {
          Message: "Creating task, please wait",
        },
      },
    },
    Result: {
      Token: {
        Title: "Your token is generated",
        Description: "Use this token to check the analysis result later (in 24 hours)",
        CopyBtnLabel: "Copy token",
        GetResultBtnLabel: "Get result",
        CopyFailedMessage: "Failed to copy token",
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
