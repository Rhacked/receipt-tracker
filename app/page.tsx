import Upload from "@/components/receipts/Upload";

export default function Home() {
  return (
    <div className="font-sans items-center justify-items-center p-8 pb-20 gap-16 sm:p-20">
      <main className="items-center sm:items-start">
        <Upload />
      </main>
    </div>
  );
}
