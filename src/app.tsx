/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

// ----------------------------------------------------------------------

import Router from 'src/routes/sections';

import {useScrollToTop} from 'src/hooks/use-scroll-to-top';

import ThemeProvider from 'src/theme';

import ProgressBar from 'src/components/progress-bar';
import {MotionLazy} from 'src/components/animate/motion-lazy';
import {SettingsDrawer, SettingsProvider} from 'src/components/settings';

import {AuthProvider} from 'src/auth/context/jwt';
import {QueryClientProvider} from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";
import {queryClient} from "./hooks/queryClient";

// ----------------------------------------------------------------------
//
export default function App() {
  const charAt = `

  ░░░    ░░░
  ▒▒▒▒  ▒▒▒▒
  ▒▒ ▒▒▒▒ ▒▒
  ▓▓  ▓▓  ▓▓
  ██      ██

  `;

  console.info(`%c${charAt}`, 'color: #5BE49B');

  useScrollToTop();


  return (
    <AuthProvider>
      <SettingsProvider
        defaultSettings={{
          themeMode: 'light', // 'light' | 'dark'
          themeDirection: 'ltr', //  'rtl' | 'ltr'
          themeContrast: 'default', // 'default' | 'bold'
          themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
          themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
          themeStretch: false,
        }}
      >
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <MotionLazy>
              <SettingsDrawer/>
              <ProgressBar/>
              <Router/>
            </MotionLazy>
            <ReactQueryDevtools initialIsOpen={false}/>
          </QueryClientProvider>
        </ThemeProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
