import { Suspense } from "react";
import ComponentContent from "./component-content";

export default function ComponentPage() {
    return (
        <Suspense>
            <ComponentContent />
        </Suspense>
    );
}
