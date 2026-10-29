"use client";

import { useLocale } from "next-intl";
import { Input } from "@/components/ui/input";
import type { AppLocale } from "@/i18n/routing";

export function InputsSection() {
  const locale = useLocale() as AppLocale;
  const isAr = locale === "ar";

  return (
    <div className="mt-10 flex w-full max-w-3xl flex-col gap-6 px-6">
      <Input
        type="text"
        label={isAr ? "الاسم الكامل" : "Full Name"}
        placeholder={isAr ? "أدخل اسمك الكامل" : "Enter your full name"}
        locale={locale}
      />

      <Input
        type="password"
        label={isAr ? "كلمة المرور" : "Password"}
        placeholder={isAr ? "أدخل كلمة المرور" : "Enter your password"}
        locale={locale}
      />

      <Input
        type="phone"
        label={isAr ? "رقم الهاتف" : "Phone Number"}
        locale={locale}
        defaultCountry="EG"
      />

      <Input
        type="search"
        label={isAr ? "بحث" : "Search"}
        placeholder={isAr ? "ابحث هنا..." : "Search here..."}
        locale={locale}
      />

      <Input
        type="otp"
        label={isAr ? "رمز التحقق (OTP)" : "OTP Code"}
        locale={locale}
      />

      <Input
        type="number"
        label={isAr ? "رقم" : "Number"}
        placeholder={isAr ? "أدخل رقماً" : "Enter a number"}
        locale={locale}
      />

      <Input
        type="file"
        label={isAr ? "ملف" : "File"}
        locale={locale}
      />

      <Input
        type="select"
        name="country"
        label={isAr ? "الدولة" : "Country"}
        placeholder={isAr ? "اختر دولة" : "Select a country"}
        locale={locale}
        options={[
          { value: "eg", label: isAr ? "مصر" : "Egypt" },
          { value: "sa", label: isAr ? "المملكة العربية السعودية" : "Saudi Arabia" },
        ]}
      />
    </div>
  );
}
