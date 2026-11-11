import {
  CalendarCheck,
  CalendarPlus,
  Car,
  ClipboardList,
  LayoutDashboard,
  ListChecks,
  Settings2,
  User,
  Users,
  Wrench
} from '@lucide/vue'

export const ROLES = [`customer`, `admin`, `worker`]

export const roleLabels =
{
  customer: `Ügyfél`,
  admin: `Admin`,
  worker: `Dolgozó`
}

export const navigation =
{
  customer:
  [
    { label: `Áttekintő`, to: `/`, icon: LayoutDashboard },
    { label: `Gépjárműveim`, to: `/vehicles`, icon: Car },
    { label: `Időpontfoglalás`, to: `/booking`, icon: CalendarPlus },
    { label: `Foglalásaim`, to: `/appointments`, icon: CalendarCheck },
    { label: `Profilom`, to: `/profile`, icon: User }
  ],
  admin:
  [
    { label: `Dashboard`, to: `/admin`, icon: LayoutDashboard },
    { label: `Foglalások`, to: `/admin/appointments`, icon: CalendarCheck },
    { label: `Javítások`, to: `/admin/repairs`, icon: Wrench },
    { label: `Felhasználók és dolgozók`, to: `/admin/users`, icon: Users },
    { label: `Szolgáltatások`, to: `/admin/services`, icon: Settings2 }
  ],
  worker:
  [
    { label: `Munkáim`, to: `/worker/jobs`, icon: ListChecks },
    { label: `Javítás részletei`, to: `/worker/repairs`, icon: ClipboardList }
  ]
}
