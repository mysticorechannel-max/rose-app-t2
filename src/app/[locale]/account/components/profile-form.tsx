"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/shared/ui/button";
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
import { DeleteAccountDialog } from "./delete-account-dialog";

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
      phone: "",
    },
  });

  // Functions
  function errorText(message?: string): string | undefined {
    return message ? t(`validation.${message}`) : undefined;
  }

  function onSubmit(values: ProfileFields): void {
    // TODO: PATCH /api/users/profile once auth is available
    console.log(values);
  }

  function handleDeleteAccount(): void {
    // TODO: DELETE /api/users/account once auth is available
    console.log("Account deleted");
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

      {/* Read-only: the PATCH endpoint does not accept email */}
      <Input label={t("profile.email")} defaultValue="" disabled />

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

      {/* Read-only: the PATCH endpoint does not accept gender */}
      <div className="space-y-2">
        <Label htmlFor="gender">{t("profile.gender")}</Label>
        <Select value="" disabled>
          <SelectTrigger id="gender">
            <SelectValue placeholder={tSelect("placeholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MALE">{t("profile.genders.male")}</SelectItem>
            <SelectItem value="FEMALE">{t("profile.genders.female")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between pt-6">
        <DeleteAccountDialog onConfirm={handleDeleteAccount} />
        <Button type="submit" className="min-w-52">
          {t("profile.save")}
        </Button>
      </div>
    </form>
  );
}