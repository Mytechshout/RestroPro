import React from 'react';
import { useTranslation } from 'react-i18next';
import Page from "../components/Page";
import AppLogo from "../components/AppLogo";
import { IconChevronLeft } from '@tabler/icons-react';
import { iconStroke } from '../config/config';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export default function NoAccessPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {theme} = useTheme();

  return (
    <Page className='px-4 py-3 flex flex-col items-center justify-center w-full min-h-screen'>
      <AppLogo theme={theme} className="mb-6 h-14 max-w-[220px]" />
      <h3 className="text-2xl text-center">{t('no_access.title')}</h3>

      <button onClick={() => navigate(-1)} className='btn btn-sm mt-6 px-3 py-1 rounded-xl hover:bg-restro-button-hover'>
        <IconChevronLeft stroke={iconStroke} /> {t('no_access.go_back')}
      </button>
    </Page>
  )
}
