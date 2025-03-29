import { PageHeader } from "@/components/app-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <main>
      <PageHeader>
        <div className="w-full h-auto  flex flex-wrap items-center justify-between p-2">
          <h1 className="text-xl font-medium">Planes de pago</h1>
          <div className="lg:flex flex-wrap gap-2 hidden">
            <Input className="w-[340px]" type="search" placeholder="Buscar" />
            <Link href="/payment-builder">
              <Button>Crear plan de pago</Button>
            </Link>
          </div>
        </div>
      </PageHeader>

      <div className="p-2">
        <div className="flex gap-2 lg:hidden">
          <Input className="" type="search" placeholder="Buscar" />
          <Link href="/payment-builder">
            <Button>Crear plan de pago</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
