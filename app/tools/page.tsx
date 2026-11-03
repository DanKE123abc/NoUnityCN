"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";

export default function CommunityPage() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('tools.title')}</h1>
            <p className="text-xl text-gray-600">{t('tools.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <div className="flex items-center gap-2">
                    {t('tools.card.modules')}
                  </div>
                  <Badge>{t('tools.card.modules.badge')}</Badge>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 mb-4">{t('tools.card.modules.desc')}</p>
                <Button className="w-full" href="./unityModule">{t('tools.card.use')}</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}