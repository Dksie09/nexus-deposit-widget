import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen p-10 font-sans">
      <div className=" w-full mx-auto px-4 py-12">
        <h1 className="font-instrument text-5xl font-medium leading">
          Deposit
        </h1>
        <p className="text-base text-white/50 mt-5 max-w-lg">
          The Deposit component provides a simple, intuitive interface for users
          to deposit tokens into the Avail Nexus network. It allows users to
          select their preferred blockchain, choose a supported token, enter an
          amount, and confirm the transaction.
        </p>
      </div>
    </div>
  );
}
