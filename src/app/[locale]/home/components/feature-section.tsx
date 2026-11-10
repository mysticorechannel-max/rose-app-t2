
import { FEATURES } from "../lib/constants/hero.contsants";
import { getTranslations } from "next-intl/server";

export default async function FeaturesSection() {
  const t = await getTranslations("home.hero.features");

  return (
    <section className="mt-4 grid grid-cols-2 gap-5 rounded-2xl bg-bg-primary-fade p-6 md:grid-cols-4 md:px-10 md:py-7">
      {FEATURES.map((feature, index) => {
        const Icon = feature.icon;

        return (
          <div key={feature.title} className="flex items-center gap-3">
            <span className="grid h-[55px] w-[55px] flex-none place-items-center rounded-full bg-[#A62027] text-white">
              <Icon size={30} />
            </span>

            <div>
              <b className="block text-[20px] text-[#A62027]">{t(`${index}.title`)}</b>
              <small className="text-sm text-text-soft">{t(`${index}.text`)}</small>
            </div>
          </div>
        );
      })}
    </section>
  );
}
