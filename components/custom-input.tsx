import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface CustomInputProps {
  label: string
  id: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  id,
  placeholder,
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`grid w-full items-center gap-1.5 mb-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        type="text"
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default CustomInput