import TrackForm from "@/components/forms/TrackForm";

export const metadata = {
  title: "پیگیری سفارش | TurkiyeKala",
};

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return (
    <div className="container-tk py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-brand-700">پیگیری سفارش</h1>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          با شماره سفارش یا شماره موبایل، وضعیت سفارش خود را ببینید.
        </p>
        <div className="mt-6">
          <TrackForm initialQuery={q ?? ""} />
        </div>
      </div>
    </div>
  );
}
