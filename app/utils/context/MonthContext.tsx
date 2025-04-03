import { createContext, useContext, useState, type ReactNode } from "react";
import dayjs from "dayjs";

interface MonthContextType {
  month: dayjs.Dayjs;
  setMonth: (month: dayjs.Dayjs) => void;
}

const MonthContext = createContext<MonthContextType | undefined>(undefined);

interface MonthProviderProps {
  children: ReactNode;
}

export const MonthProvider: React.FC<MonthProviderProps> = ({ children }) => {
  const [month, setMonth] = useState<dayjs.Dayjs>(dayjs());

  return (
    <MonthContext.Provider value={{ month, setMonth }}>
      {children}
    </MonthContext.Provider>
  );
};

export const useMonth = (): MonthContextType => {
  const context = useContext(MonthContext);
  if (!context) {
    throw new Error("useMonth must be used within a MonthProvider");
  }
  return context;
};
