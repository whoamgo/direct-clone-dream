import React from "react";
import { useForm, FormProvider, UseFormProps } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

interface FormWrapperProps<T> extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  onSubmit: (data: T) => void | Promise<void>;
  validationSchema: Yup.ObjectSchema<any>;
  defaultValues?: T;
  isLoading?: boolean;
}

export const FormWrapper = React.forwardRef<
  HTMLFormElement,
  FormWrapperProps<any>
>(
  (
    {
      children,
      onSubmit,
      validationSchema,
      defaultValues,
      isLoading = false,
      className,
      ...props
    },
    ref
  ) => {
    const methods = useForm({
      resolver: yupResolver(validationSchema),
      mode: "onBlur",
      defaultValues,
    });

    const handleSubmit = async (data: any) => {
      try {
        await onSubmit(data);
      } catch (error) {
        console.error("Form submission error:", error);
      }
    };

    return (
      <FormProvider {...methods}>
        <form
          ref={ref}
          onSubmit={methods.handleSubmit(handleSubmit)}
          className={className}
          {...props}
        >
          {children}
        </form>
      </FormProvider>
    );
  }
);

FormWrapper.displayName = "FormWrapper";
