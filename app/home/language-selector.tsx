'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageSelectorProps {
  languages: Language[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function LanguageSelector({
  languages,
  defaultValue,
  onValueChange,
  className = 'w-full border-amber-600 text-sidebar-foreground',
}: LanguageSelectorProps) {
  const defaultLanguage =
    languages.find(lang => lang.code === defaultValue) || languages[0];

  return (
    <Select defaultValue={defaultValue} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue>
          <div className='flex items-center gap-3'>
            <span className='text-lg'>{defaultLanguage?.flag}</span>
            <span>{defaultLanguage?.name}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map(language => (
          <SelectItem key={language.code} value={language.code}>
            <div className='flex items-center gap-3'>
              <span className='text-lg'>{language.flag}</span>
              <span>{language.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
