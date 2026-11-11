"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";

import { type ProfileValues, profileSchema } from "../_lib/schemas";
import { useRegister } from "../_providers/register-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FooterLink } from "../../_components/auth-footer-link";

export function StepProfile() {
  const t = useTranslations("auth.register");
  const { profile, setProfile, goTo } = useRegister();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    // Coming back from the password step keeps what was typed.
    defaultValues: profile ?? {
      firstName: "",
      lastName: "",
      username: "",
      phoneCode: "+20",
      phone: "",
      gender: undefined,
    },
  });

  const getError = (name: keyof ProfileValues) => {
    const message = errors[name]?.message;
    return message ? t(`validation.${message}`) : undefined;
  };

  function onSubmit(values: ProfileValues) {
    setProfile(values);
    goTo("password");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="firstName"
          label={t("fields.firstName")}
          type="text"
          autoComplete="given-name"
          placeholder="please enter your first name"
          error={getError("firstName")}
          {...register("firstName")}
        />

        <Input
          id="lastName"
          label={t("fields.lastName")}
          type="text"
          autoComplete="family-name"
          placeholder="please enter your last name"
          error={getError("lastName")}
          {...register("lastName")}
        />
      </div>

      <Input
        id="username"
        label={t("fields.username")}
        type="text"
        autoComplete="username"
        placeholder="please enter your username"
        error={getError("username")}
        {...register("username")}
      />

      <Input
        id="phone"
        label={t("fields.phone")}
        type="phone"
        defaultCountry="EG"
        autoComplete="tel"
        placeholder="please enter your phone number"
        error={getError("phone")}
        {...register("phone")}
      />

      <div className="space-y-2">
        <Label htmlFor="gender">{t("fields.gender")}</Label>

        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value ?? ""}
              onValueChange={field.onChange}
              disabled={field.disabled}
            >
              <SelectTrigger
                id="gender"
                className="w-full"
                aria-invalid={!!errors.gender}
                onBlur={field.onBlur}
              >
                <SelectValue placeholder={t("fields.genderPlaceholder")} />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="MALE">{t("fields.male")}</SelectItem>

                <SelectItem value="FEMALE">{t("fields.female")}</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {getError("gender") && (
          <p role="alert" className="text-text-danger text-sm">
            {getError("gender")}
          </p>
        )}
      </div>

      <Button type="submit" className="mt-2 w-full">
        {t("actions.next")}
      </Button>

      <FooterLink messageKey="needHelp" linkKey="contactUs" href="/contact-us" />
    </form>
  );
}

