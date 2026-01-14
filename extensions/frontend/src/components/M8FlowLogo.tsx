/**
 * M8FlowLogo Component
 *
 * Displays the M8Flow logo with support for different variants:
 * - full: Icon + text
 * - icon: Icon only (for collapsed nav)
 * - text: Text only
 *
 * Supports both light and dark themes automatically.
 */

import React from 'react';
import { Stack, Typography, useTheme } from '@mui/material';

// Import SVG logos as React components (via vite-plugin-svgr)
import M8FlowIcon from '../assets/logos/m8flow-icon.svg';
import M8FlowLogoFull from '../assets/logos/m8flow-logo.svg';
import M8FlowLogoWhite from '../assets/logos/m8flow-logo-white.svg';

export interface M8FlowLogoProps {
  /** Logo variant to display */
  variant?: 'full' | 'icon' | 'text';

  /** Size preset */
  size?: 'small' | 'medium' | 'large';

  /** Whether the navigation is collapsed (shows icon only) */
  collapsed?: boolean;

  /** Custom width */
  width?: number | string;

  /** Custom height */
  height?: number | string;

  /** Additional CSS class */
  className?: string;
}

// Size presets
const sizePresets = {
  small: { icon: 24, text: 16, logoWidth: 100 },
  medium: { icon: 32, text: 20, logoWidth: 140 },
  large: { icon: 48, text: 28, logoWidth: 200 },
};

/**
 * M8FlowLogo Component
 *
 * Renders the M8Flow brand logo with flexible sizing and variants.
 */
export default function M8FlowLogo({
  variant = 'full',
  size = 'medium',
  collapsed = false,
  width,
  height,
  className,
}: M8FlowLogoProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const preset = sizePresets[size];

  // If collapsed, always show icon only
  const effectiveVariant = collapsed ? 'icon' : variant;

  // Calculate dimensions
  const iconSize = height || preset.icon;
  const logoWidth = width || preset.logoWidth;

  // Icon only variant
  if (effectiveVariant === 'icon') {
    return (
      <Stack
        className={className}
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <M8FlowIcon
          width={iconSize}
          height={iconSize}
          aria-label="M8Flow"
        />
      </Stack>
    );
  }

  // Text only variant
  if (effectiveVariant === 'text') {
    return (
      <Typography
        className={className}
        sx={{
          fontSize: preset.text,
          fontWeight: 600,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        M8Flow
      </Typography>
    );
  }

  // Full logo variant (icon + text)
  // Use white logo for dark mode, colored logo for light mode
  const LogoComponent = isDark ? M8FlowLogoWhite : M8FlowLogoFull;

  return (
    <Stack
      direction="row"
      className={className}
      sx={{
        alignItems: 'center',
        gap: 0,
      }}
    >
      <LogoComponent
        width={logoWidth}
        height={iconSize}
        aria-label="M8Flow"
      />
    </Stack>
  );
}

/**
 * M8FlowIcon Component
 *
 * Standalone icon component for use in navigation, favicons, etc.
 */
export function M8FlowIconOnly({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <M8FlowIcon
      width={size}
      height={size}
      className={className}
      aria-label="M8Flow"
    />
  );
}

/**
 * M8FlowBrandText Component
 *
 * Standalone text component with gradient styling.
 */
export function M8FlowBrandText({
  size = 'medium',
  className,
}: {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}) {
  const theme = useTheme();
  const preset = sizePresets[size];

  return (
    <Typography
      className={className}
      component="span"
      sx={{
        fontSize: preset.text,
        fontWeight: 600,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      M8Flow
    </Typography>
  );
}
