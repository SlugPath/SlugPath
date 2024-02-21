import Image from "next/image";

export default function NotFound() {
  return (
    <main className="grid h-screen place-items-center bg-gray-100">
      <div className="h-96 flex flex-row w-auto max-w-2xl gap-3 place-items-center">
        <Image
          src="/images/slug-icon-error.png"
          width={250}
          height={250}
          alt="Slug Icon"
          className="col-span-1 self-center px-2"
        />
        <div className="pt-6 px-3 col-span-2 flex flex-col gap-2">
          <div className="text-center text-5xl text-bold">404 Error</div>
          <div className="text-center text-xl">Uh oh...</div>
          <div className="text-center">
            We could not find the requested resource. The page you&apos;re
            looking for may have been removed, renamed, or possibly never
            existed.
          </div>
        </div>
      </div>
    </main>
  );
}
