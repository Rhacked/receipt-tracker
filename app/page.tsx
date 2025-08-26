import Upload from "@/components/receipts/Upload";

export default function Home() {
  return (
    <div className="font-sans items-center p-8 pb-20 gap-16 md:max-w-[750px] mx-auto">
      <main className="items-center sm:items-start">
        <Upload />
      </main>
    </div>
  );
}
