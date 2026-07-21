import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Project {
  id: string;
  name: string;
  description: string;
  targetMCU: string | null;
  package: string | null;
  stage: "init" | "planning" | "design" | "review" | "done";
  createdAt: number;
  updatedAt: number;
  skillsUsed: string[];
}

interface ProjectState {
  projects: Project[];
  activeProjectId: string | null;
  setActiveProject: (id: string | null) => void;
  addProject: (p: Project) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  removeProject: (id: string) => void;
  getActiveProject: () => Project | undefined;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [
        {
          id: "demo-1",
          name: "智能灌溉控制器",
          description: "太阳能供电，低功耗，土壤湿度监测",
          targetMCU: "STM32L431CBT6",
          package: "LQFP-48",
          stage: "design",
          createdAt: Date.now() - 86400000 * 3,
          updatedAt: Date.now(),
          skillsUsed: ["chip-select", "pinmap", "power"],
        },
        {
          id: "demo-2",
          name: "四轴无人机飞控",
          description: "姿态解算 + PID 控制 + 无线数传",
          targetMCU: "STM32F407VET6",
          package: "LQFP-100",
          stage: "review",
          createdAt: Date.now() - 86400000 * 7,
          updatedAt: Date.now() - 86400000 * 1,
          skillsUsed: ["chip-select", "arch", "pinmap", "clock", "bom"],
        },
        {
          id: "demo-3",
          name: "BLE 智能手环",
          description: "心率监测 + 计步 + BLE 推送",
          targetMCU: "STM32WB55CGU6",
          package: "UFQFPN-48",
          stage: "init",
          createdAt: Date.now() - 86400000 * 1,
          updatedAt: Date.now() - 3600000 * 2,
          skillsUsed: ["req"],
        },
      ],
      activeProjectId: null,
      setActiveProject: (id) => set({ activeProjectId: id }),
      addProject: (p) =>
        set((s) => ({ projects: [p, ...s.projects] })),
      updateProject: (id, patch) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id ? { ...p, ...patch, updatedAt: Date.now() } : p,
          ),
        })),
      removeProject: (id) =>
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          activeProjectId:
            s.activeProjectId === id ? null : s.activeProjectId,
        })),
      getActiveProject: () =>
        get().projects.find((p) => p.id === get().activeProjectId),
    }),
    { name: "chipflow-projects" },
  ),
);
