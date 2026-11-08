"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";

import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import {
  profileSchema,
  type ProfileFields,
} from "../lib/schemes/profile.schema";
import { AvatarUpload } from "./avatar-upload";
import { Button } from "@/shared/ui/button";

export function ProfileForm() {
  // Translation
  const t = useTranslations("account");
  const tSelect = useTranslations("select");

  // Form & validation
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFields>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: undefined,
    },
  });

  // Functions
  function errorText(message?: string): string | undefined {
    return message ? t(`validation.${message}`) : undefined;
  }

  function onSubmit(values: ProfileFields): void {
    console.log(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <AvatarUpload />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label={t("profile.firstName")}
          error={errorText(errors.firstName?.message)}
          {...register("firstName")}
        />
        <Input
          label={t("profile.lastName")}
          error={errorText(errors.lastName?.message)}
          {...register("lastName")}
        />
      </div>

      <Input
        label={t("profile.email")}
        inputMode="email"
        autoComplete="email"
        error={errorText(errors.email?.message)}
        {...register("email")}
      />

      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <Input
            type="phone"
            label={t("profile.phone")}
            defaultCountry="EG"
            value={field.value}
            onValueChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
            error={errorText(errors.phone?.message)}
          />
        )}
      />

      <div className="space-y-2">
        <Label htmlFor="gender">{t("profile.gender")}</Label>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Select value={field.value ?? ""} onValueChange={field.onChange}>
              <SelectTrigger
                id="gender"
                ref={field.ref}
                onBlur={field.onBlur}
                aria-invalid={Boolean(errors.gender)}
              >
                <SelectValue placeholder={tSelect("placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{t("profile.genders.male")}</SelectItem>
                <SelectItem value="female">
                  {t("profile.genders.female")}
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.gender && (
          <p role="alert" className="text-sm text-text-danger">
            {errorText(errors.gender.message)}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-6">
  <Button type="button" variant="ghost" className="text-text-danger">
    {t("profile.delete")}
  </Button>
  <Button type="submit" className="min-w-52">
    {t("profile.save")}
  </Button>
</div>
    </form>
  );
}