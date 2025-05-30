"use client";

import { Brush } from "lucide-react";
import FormConfigSection from "@/components/common/FormConfigSection";

import fields from "./fields";

const {
  FormFontPicker,
  FormThemePicker,
  FormFontPrimaryColor,
  FormFontSecondaryColor,
} = fields;

const FormCustomization = () => {
  return (
    <FormConfigSection
      icon={<Brush className="w-4 h-4 text-white/90" />}
      title="Form Appearance"
      subtitle="Make your form look like your brand."
    >
      <div className="flex flex-col gap-3 bg-background px-3 py-5 border border-input border-dashed rounded-md min-w-100">
        <FormThemePicker />
        <FormFontPicker />
        <FormFontPrimaryColor />
        <FormFontSecondaryColor />
      </div>
    </FormConfigSection>
  );
};

export default FormCustomization;
