import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const DashboardPage = () => {
  const router = useRouter();

  const { locale, locales, defaultLocale } = router;
  const { t } = useTranslation('common');

  useEffect(() => {
    if (locale) {
      console.log(`locale: ${locale}`);
      console.log(`locales: ${locales}`);
      console.log(`defaultLocale: ${defaultLocale}`);
    }
  }, [locale]);

  return <div>{t('dashboard')}</div>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'ko', ['common'])),
  },
});

export default DashboardPage;
