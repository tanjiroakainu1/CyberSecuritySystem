import { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="modal-panel animate-slide-up">
        <div className="modal-panel-header mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="pr-4 text-lg font-bold text-gradient-brand">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div className="toast-container">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
      </span>
      <span className="min-w-0 flex-1">{message}</span>
    </div>
  );
}

interface FieldProps {
  label: string;
  children: ReactNode;
  dark?: boolean;
}

export function Field({ label, children, dark }: FieldProps) {
  return (
    <div>
      <label className={dark ? 'auth-label' : 'mb-1.5 block text-sm font-medium text-slate-700'}>
        {label}
      </label>
      <div className={dark ? '' : 'mt-1'}>{children}</div>
    </div>
  );
}

const inputClass =
  'w-full min-h-[44px] rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-base text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-cyber-500 focus:outline-none focus:ring-2 focus:ring-cyber-500/20 min-[480px]:text-sm';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { dark?: boolean };

export function TextInput({ dark, className = '', ...props }: InputProps) {
  return <input className={`${dark ? 'auth-input' : inputClass} ${className}`.trim()} {...props} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${inputClass} min-h-[100px] resize-y`} {...props} />;
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & { dark?: boolean };

export function SelectInput({ dark, className = '', ...props }: SelectProps) {
  return <select className={`${dark ? 'auth-input' : inputClass} ${className}`.trim()} {...props} />;
}

interface FormActionsProps {
  onCancel: () => void;
  submitLabel?: string;
}

export function FormActions({ onCancel, submitLabel = 'Save' }: FormActionsProps) {
  return (
    <div className="form-actions">
      <button type="button" onClick={onCancel} className="btn-secondary">
        Cancel
      </button>
      <button type="submit" className="btn-primary">
        {submitLabel}
      </button>
    </div>
  );
}

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-cyber-200/60 bg-gradient-to-br from-cyber-50/30 to-white px-4 py-12 text-center min-[480px]:px-6 min-[480px]:py-16">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyber-100 to-emerald-100 text-3xl shadow-soft">
        📋
      </div>
      <p className="text-sm font-medium text-slate-600">{message}</p>
      <p className="mt-1 text-xs text-slate-400">Use the action button above to get started</p>
    </div>
  );
}

interface CrudTableProps {
  headers: string[];
  rows: (string | number | ReactNode)[][];
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
}

export function CrudTable({ headers, rows, onEdit, onDelete }: CrudTableProps) {
  const showActions = onEdit || onDelete;
  const allHeaders = showActions ? [...headers, 'Actions'] : headers;

  if (rows.length === 0) {
    return <EmptyState message="No records yet. Create one using the button above." />;
  }

  return (
    <>
      {/* Mobile card view */}
      <div className="space-y-3 md:hidden">
        {rows.map((row, i) => (
          <div key={i} className="table-mobile-card animate-scale-in">
            <div className="space-y-3">
              {row.map((cell, j) => (
                <div key={j}>
                  <p className="table-mobile-label">{headers[j]}</p>
                  <div className="table-mobile-value break-words">{cell}</div>
                </div>
              ))}
            </div>
            {showActions && (
              <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                {onEdit && (
                  <button type="button" onClick={() => onEdit(i)} className="btn-edit flex-1">
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button type="button" onClick={() => onDelete(i)} className="btn-danger flex-1">
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="table-wrapper hidden md:block">
        <div className="table-scroll">
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-cyber-50/30">
                {allHeaders.map((header) => (
                  <th key={header} className="table-th">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {rows.map((row, i) => (
                <tr key={i} className="transition-colors hover:bg-cyber-50/40">
                  {row.map((cell, j) => (
                    <td key={j} className="table-td max-w-xs truncate">
                      {cell}
                    </td>
                  ))}
                  {showActions && (
                    <td className="table-td">
                      <div className="flex flex-wrap gap-1">
                        {onEdit && (
                          <button type="button" onClick={() => onEdit(i)} className="btn-edit">
                            Edit
                          </button>
                        )}
                        {onDelete && (
                          <button type="button" onClick={() => onDelete(i)} className="btn-danger">
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Active: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/60',
    Completed: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/60',
    Resolved: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/60',
    Closed: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200/60',
    Open: 'bg-cyber-100 text-cyber-800 ring-1 ring-cyber-200/60',
    Draft: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200/60',
    Pending: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200/60',
    'In Progress': 'bg-cyan-100 text-cyan-800 ring-1 ring-cyan-200/60',
    Critical: 'bg-red-100 text-red-800 ring-1 ring-red-200/60',
    High: 'bg-orange-100 text-orange-800 ring-1 ring-orange-200/60',
    Medium: 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200/60',
    Low: 'bg-green-100 text-green-800 ring-1 ring-green-200/60',
    Inactive: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200/60',
    Read: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200/60',
    Unread: 'bg-cyber-100 text-cyber-800 ring-1 ring-cyber-200/60',
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors[status] ?? 'bg-slate-100 text-slate-700 ring-1 ring-slate-200/60'}`}
    >
      {status}
    </span>
  );
}
