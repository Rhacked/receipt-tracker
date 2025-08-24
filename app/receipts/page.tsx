import List from "@/components/receipts/List";

export default function ReceiptsPage() {
  return (
    <div className="font-sans items-center justify-items-center p-8 pb-20 gap-16">
      <main className="items-center sm:items-start">
        <header className="mb-4">
          <h1 className="text-5xl font-semibold">Receipts</h1>
          <p>Here you can find an overview of your uploaded receipts.</p>
        </header>
        <List />
      </main>
    </div>
  );
}
