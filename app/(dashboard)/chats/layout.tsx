"use client";

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-3 md:p-5 h-full">
      <div className="w-full h-full overflow-hidden rounded-xl border border-[#EAEAEA]">
        {children}
      </div>
    </div>
  );
}
