import Plan from "@/components/Plan/Plan";
import { BlackHeader } from "@/components/BlackHeader";
import { BlackFooter } from "@/components/BlackFooter";
export default function PublicPlanPage({}: {}) {
  return (
    <>
      <section className="bg-black">
        <BlackHeader />
        <Plan callBy="" />
        <BlackFooter />
      </section>
    </>
  );
}
