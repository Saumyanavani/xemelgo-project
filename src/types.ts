export type SolutionType = 'asset' | 'inventory' | 'work_order'
export type ItemStatus = 'active' | 'missing' | 'consumed' | 'complete'
export type ActionType = 'move' | 'missing' | 'scan' | 'consume' | 'receive' | 'complete'

export interface User {
  id: string
  name: string
  role: string
}

export interface Location {
  id: string
  name: string
}

export interface Item {
  id: string
  name: string
  solutionType: SolutionType
  status: ItemStatus
  currentLocationId: string | null
}

export interface LocationEvent {
  id: string
  itemId: string
  locationId: string
  timestamp: string
}

export interface ActionEvent {
  id: string
  itemId: string
  userId: string
  actionType: ActionType
  locationId: string | null
  timestamp: string
}

export interface DashboardItemView {
  id: string
  name: string
  solutionType: SolutionType
  solutionLabel: string
  locationName: string
  status: ItemStatus
}

export interface LocationEventView {
  id: string
  locationId: string
  locationName: string
  timestamp: string
}

export interface ActionEventView {
  id: string
  userId: string
  userName: string
  actionLabel: string
  timestamp: string
}

export interface ItemDetailView {
  item: Item & {
    solutionLabel: string
    solutionTitle: string
    currentLocationName: string
    terminalActionLabel: string
    terminalActionType: ActionType
    locationActionLabel: string
    locationActionType: ActionType
  }
  locationHistory: LocationEventView[]
  actionHistory: ActionEventView[]
}
