"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, type PointerEvent } from "react";

export default function HomeAvatarLink() {
  const router = useRouter();
  const holdTimer = useRef<number | null>(null);
  const didLongPress = useRef(false);

  function cancelHold() {
    if (holdTimer.current !== null) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }

  function startHold(event: PointerEvent<HTMLAnchorElement>) {
    if (!event.isPrimary || event.button !== 0) return;

    didLongPress.current = false;
    cancelHold();
    holdTimer.current = window.setTimeout(() => {
      didLongPress.current = true;
      router.push("/portal");
    }, 650);
  }

  return (
    <Link
      href="/"
      aria-label="Home; press and hold to open the portal"
      title="Tap to go home; press and hold to open the portal"
      onPointerDown={startHold}
      onPointerUp={cancelHold}
      onPointerLeave={cancelHold}
      onPointerCancel={cancelHold}
      onContextMenu={(event) => event.preventDefault()}
      onClick={(event) => {
        if (!didLongPress.current) return;
        event.preventDefault();
        didLongPress.current = false;
      }}
      className="flex items-center overflow-hidden rounded-full border border-[#12211f]/10 bg-white shadow-sm ring-1 ring-black/5"
    >
      <Image
        src="/jolo.jpg"
        alt="Jolomi Dudu"
        width={40}
        height={40}
        draggable={false}
        className="h-10 w-10 select-none object-cover"
      />
    </Link>
  );
}
