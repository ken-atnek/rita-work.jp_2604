'use client';

import clsx from 'clsx';
import styles from './JobsFilter.module.scss';

type Option = {
  id: string;
  label: string;
};

type Props = {
  title: string;

  salaryTab: 'yearly' | 'hourly';
  onChangeSalaryTab: (tab: 'yearly' | 'hourly') => void;

  yearlyOptions: Option[];
  hourlyOptions: Option[];

  yearlyValue: string[];
  hourlyValue: string[];

  onChangeYearly: (ids: string[]) => void;
  onChangeHourly: (ids: string[]) => void;

  isOpen: boolean;
  onToggleOpen: () => void;
};

export function SalaryField({
  title,
  salaryTab,
  onChangeSalaryTab,
  yearlyOptions,
  hourlyOptions,
  yearlyValue,
  hourlyValue,
  onChangeYearly,
  onChangeHourly,
  isOpen,
  onToggleOpen,
}: Props) {
  const handleToggleYearly = () => {
    onChangeSalaryTab('yearly');
    onChangeHourly([]); // ← 排他：時給をリセット
  };

  const handleToggleHourly = () => {
    onChangeSalaryTab('hourly');
    onChangeYearly([]); // ← 排他：年収をリセット
  };

  const handleToggleValue = (
    current: string[],
    id: string,
    onChange: (ids: string[]) => void
  ) => {
    if (current.includes(id)) {
      onChange(current.filter((v) => v !== id));
    } else {
      onChange([...current, id]);
    }
  };

  const options = salaryTab === 'yearly' ? yearlyOptions : hourlyOptions;
  const value = salaryTab === 'yearly' ? yearlyValue : hourlyValue;
  const onChange = salaryTab === 'yearly' ? onChangeYearly : onChangeHourly;

  const hasValue =
    salaryTab === 'yearly' ? yearlyValue.length > 0 : hourlyValue.length > 0;

  return (
    <div
      className={clsx(
        styles.itemFilter,
        styles.salaryField,
        hasValue && styles.isSelected
      )}
    >
      <button type="button" onClick={onToggleOpen}>
        {title}
      </button>

      <div className={clsx(styles.wrapFilterList, isOpen && styles.isOpen)}>
        <div className={styles.innerFilterList}>
          <div className={styles.itemFilterList}>
            <div className={styles.wrapHead}>
              <h3>{title}</h3>
              <span
                className={styles.btnClose}
                role="button"
                tabIndex={0}
                aria-label="閉じる"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleOpen();
                }}
              />
            </div>

            {/* タブ */}
            <div className={styles.tabs}>
              <button
                type="button"
                className={salaryTab === 'yearly' ? styles.isActive : ''}
                onClick={handleToggleYearly}
              >
                年収
              </button>
              <button
                type="button"
                className={salaryTab === 'hourly' ? styles.isActive : ''}
                onClick={handleToggleHourly}
              >
                時給
              </button>
            </div>

            {/* リスト */}
            <ul>
              {options.map((opt) => (
                <li key={opt.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={value.includes(opt.id)}
                      onChange={() =>
                        handleToggleValue(value, opt.id, onChange)
                      }
                    />
                    <span>{opt.label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
