import { Suspense } from 'react';
import ReleaseNotesContent from './ReleaseNotesContent';

export default function ReleaseNotesPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center p-12">
                    <div className="text-gray-500">加载中...</div>
                </div>
            }
        >
            <ReleaseNotesContent />
        </Suspense>
    );
}
