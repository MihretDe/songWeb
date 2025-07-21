import styled from "@emotion/styled"
import { css } from "@emotion/react"

// Theme
export const theme = {
  colors: {
    primary: "#3b82f6",
    primaryHover: "#2563eb",
    secondary: "#6b7280",
    success: "#10b981",
    danger: "#ef4444",
    dangerHover: "#dc2626",
    background: "#ffffff",
    surface: "#f9fafb",
    border: "#e5e7eb",
    text: "#111827",
    textSecondary: "#6b7280",
    textMuted: "#9ca3af",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    xxl: "3rem",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  },
}

// Container
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
`

// Header
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
`

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${theme.colors.text};
  margin: 0;
`

export const Subtitle = styled.p`
  color: ${theme.colors.textSecondary};
  margin: ${theme.spacing.xs} 0 0 0;
`

// Card
export const Card = styled.div`
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  overflow: hidden;
`

export const CardHeader = styled.div`
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};
`

export const CardContent = styled.div`
  padding: ${theme.spacing.lg};
`

// Button
export const Button = styled.button<{ variant?: "primary" | "secondary" | "danger"; size?: "sm" | "md" | "lg" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  padding: ${(props) =>
    props.size === "sm"
      ? `${theme.spacing.sm} ${theme.spacing.md}`
      : props.size === "lg"
        ? `${theme.spacing.lg} ${theme.spacing.xl}`
        : `${theme.spacing.md} ${theme.spacing.lg}`};
  font-size: ${(props) => (props.size === "sm" ? "0.875rem" : "1rem")};
  font-weight: 500;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;

  ${(props) => {
    switch (props.variant) {
      case "danger":
        return css`
          background-color: ${theme.colors.danger};
          color: white;
          &:hover:not(:disabled) {
            background-color: ${theme.colors.dangerHover};
          }
        `
      case "secondary":
        return css`
          background-color: transparent;
          color: ${theme.colors.secondary};
          border-color: ${theme.colors.border};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.surface};
          }
        `
      default:
        return css`
          background-color: ${theme.colors.primary};
          color: white;
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primaryHover};
          }
        `
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

// Table
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

export const TableHeader = styled.thead`
  background-color: ${theme.colors.surface};
`

export const TableRow = styled.tr`
  border-bottom: 1px solid ${theme.colors.border};
  
  &:hover {
    background-color: ${theme.colors.surface};
  }
`

export const TableHead = styled.th`
  padding: ${theme.spacing.md};
  text-align: left;
  font-weight: 600;
  color: ${theme.colors.text};
`

export const TableCell = styled.td`
  padding: ${theme.spacing.md};
  color: ${theme.colors.text};
`

// Form
export const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.lg};
`

export const Label = styled.label`
  display: block;
  font-weight: 500;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.sm};
`

export const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
  }
`

// Modal
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

export const ModalContent = styled.div`
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.lg};
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`

export const ModalHeader = styled.div`
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};
`

export const ModalBody = styled.div`
  padding: ${theme.spacing.lg};
`

export const ModalFooter = styled.div`
  padding: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.border};
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;
`

// Pagination
export const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${theme.spacing.lg};
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.border};
`

export const PaginationInfo = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: 0.875rem;
`

export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`

// Badge
export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${theme.colors.surface};
  color: ${theme.colors.textSecondary};
  border-radius: ${theme.borderRadius.sm};
`

// Loading
export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${theme.colors.textMuted};
`

// Error
export const ErrorMessage = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.lg};
`
