import Dexie, { type Table } from 'dexie'

import type {
  ActionEvent,
  ActionType,
  DashboardItemView,
  Item,
  ItemDetailView,
  ItemStatus,
  Location,
  LocationEvent,
  SolutionType,
  User,
} from '../types'

const ACTIVE_USER_KEY = 'xemelgo.active-user-id'
const SEED_VERSION_KEY = 'xemelgo.seed-version'
const SEED_VERSION = '2026-04-19-v1'

class XemelgoDatabase extends Dexie {
  users!: Table<User, string>
  locations!: Table<Location, string>
  items!: Table<Item, string>
  locationEvents!: Table<LocationEvent, string>
  actionEvents!: Table<ActionEvent, string>

  constructor() {
    super('xemelgo-dashboard')

    // IndexedDB gives the take-home a real local database without requiring a backend.
    this.version(1).stores({
      users: 'id',
      locations: 'id',
      items: 'id, solutionType, currentLocationId, status',
      locationEvents: 'id, itemId, locationId, timestamp',
      actionEvents: 'id, itemId, userId, actionType, timestamp',
    })
  }
}

const db = new XemelgoDatabase()

const USERS: User[] = [
  { id: 'user-tabitha', name: 'Tabitha Ryne', role: 'Xemelgo Administrator' },
  { id: 'user-claire', name: 'Claire Stroup', role: 'Operations Analyst' },
  { id: 'user-curtis', name: 'Curtis Trak', role: 'Shop Manager' },
  { id: 'user-jacob', name: 'Jacob Eld', role: 'Inventory Lead' },
]

const LOCATIONS: Location[] = [
  { id: 'location-1', name: 'Storage 1' },
  { id: 'location-2', name: 'Storage 2' },
  { id: 'location-3', name: 'Storage 3' },
  { id: 'location-4', name: 'Storage 4' },
]

const ITEMS: Item[] = [
  { id: 'item-01', name: 'Item 1', solutionType: 'asset', status: 'active', currentLocationId: 'location-1' },
  { id: 'item-02', name: 'Item 2', solutionType: 'inventory', status: 'active', currentLocationId: 'location-2' },
  { id: 'item-03', name: 'Item 3', solutionType: 'inventory', status: 'active', currentLocationId: 'location-2' },
  { id: 'item-04', name: 'Item 4', solutionType: 'asset', status: 'active', currentLocationId: 'location-3' },
  { id: 'item-05', name: 'Item 5', solutionType: 'work_order', status: 'active', currentLocationId: 'location-1' },
  { id: 'item-06', name: 'Item 6', solutionType: 'work_order', status: 'active', currentLocationId: 'location-4' },
  { id: 'item-07', name: 'Item 7', solutionType: 'asset', status: 'active', currentLocationId: 'location-1' },
  { id: 'item-08', name: 'Item 8', solutionType: 'inventory', status: 'active', currentLocationId: 'location-3' },
  { id: 'item-09', name: 'Item 9', solutionType: 'inventory', status: 'active', currentLocationId: 'location-3' },
  { id: 'item-10', name: 'Item 10', solutionType: 'work_order', status: 'active', currentLocationId: 'location-4' },
  { id: 'item-11', name: 'Item 11', solutionType: 'asset', status: 'active', currentLocationId: 'location-4' },
  { id: 'item-12', name: 'Item 12', solutionType: 'work_order', status: 'active', currentLocationId: 'location-2' },
]

const TIMESTAMPS = [
  '2025-07-19T16:45:00.000',
  '2025-07-19T15:23:00.000',
  '2025-07-19T14:57:00.000',
  '2025-07-19T13:05:00.000',
  '2025-07-19T11:31:00.000',
  '2025-07-19T09:18:00.000',
]

const USER_HISTORY_PATTERN = [
  'user-tabitha',
  'user-jacob',
  'user-jacob',
  'user-claire',
  'user-curtis',
  'user-tabitha',
]

const LOCATION_HISTORY_PATTERN: Record<string, string[]> = {
  'location-1': ['location-1', 'location-2', 'location-1', 'location-4', 'location-2', 'location-1'],
  'location-2': ['location-2', 'location-3', 'location-1', 'location-4', 'location-2', 'location-1'],
  'location-3': ['location-3', 'location-2', 'location-1', 'location-4', 'location-3', 'location-2'],
  'location-4': ['location-4', 'location-2', 'location-1', 'location-4', 'location-2', 'location-1'],
}

function getSolutionLabel(solutionType: SolutionType) {
  switch (solutionType) {
    case 'asset':
      return 'Asset'
    case 'inventory':
      return 'Inventory'
    case 'work_order':
      return 'WO'
  }
}

function getLocationActionType(solutionType: SolutionType): ActionType {
  switch (solutionType) {
    case 'asset':
      return 'move'
    case 'inventory':
      return 'scan'
    case 'work_order':
      return 'receive'
  }
}

function getTerminalActionType(solutionType: SolutionType): ActionType {
  switch (solutionType) {
    case 'asset':
      return 'missing'
    case 'inventory':
      return 'consume'
    case 'work_order':
      return 'complete'
  }
}

function getLocationActionLabel(solutionType: SolutionType) {
  switch (solutionType) {
    case 'asset':
      return 'Move to'
    case 'inventory':
      return 'Scan at'
    case 'work_order':
      return 'Receive at'
  }
}

function getTerminalActionLabel(solutionType: SolutionType) {
  switch (solutionType) {
    case 'asset':
      return 'Missing'
    case 'inventory':
      return 'Consume'
    case 'work_order':
      return 'Complete'
  }
}

function getActionHistoryLabel(actionType: ActionType) {
  switch (actionType) {
    case 'move':
      return 'Moved'
    case 'missing':
      return 'Missing'
    case 'scan':
      return 'Scanned'
    case 'consume':
      return 'Consumed'
    case 'receive':
      return 'Received'
    case 'complete':
      return 'Completed'
  }
}

function getStatusFromAction(actionType: ActionType): ItemStatus {
  switch (actionType) {
    case 'missing':
      return 'missing'
    case 'consume':
      return 'consumed'
    case 'complete':
      return 'complete'
    default:
      return 'active'
  }
}

function isLocationAction(actionType: ActionType) {
  return actionType === 'move' || actionType === 'scan' || actionType === 'receive'
}

function createSeedRecords() {
  const locationEvents: LocationEvent[] = []
  const actionEvents: ActionEvent[] = []

  // Seed histories are shaped to match the mockups so the first load feels presentation-ready.
  for (const item of ITEMS) {
    const locationPattern = LOCATION_HISTORY_PATTERN[item.currentLocationId ?? 'location-1']
    const seededActionType = getLocationActionType(item.solutionType)

    for (const [index, timestamp] of TIMESTAMPS.entries()) {
      const locationId = locationPattern[index]

      locationEvents.push({
        id: `${item.id}-location-${index + 1}`,
        itemId: item.id,
        locationId,
        timestamp,
      })

      actionEvents.push({
        id: `${item.id}-action-${index + 1}`,
        itemId: item.id,
        userId: USER_HISTORY_PATTERN[index],
        actionType: seededActionType,
        locationId,
        timestamp,
      })
    }
  }

  return { locationEvents, actionEvents }
}

async function clearDatabase() {
  await db.transaction('rw', [db.users, db.locations, db.items, db.locationEvents, db.actionEvents], async () => {
    await db.actionEvents.clear()
    await db.locationEvents.clear()
    await db.items.clear()
    await db.locations.clear()
    await db.users.clear()
  })
}

function getLocationName(locationId: string | null, locationsById: Map<string, Location>) {
  if (!locationId) {
    return 'NA'
  }

  return locationsById.get(locationId)?.name ?? 'NA'
}

export function getActiveUserId() {
  return localStorage.getItem(ACTIVE_USER_KEY)
}

export function setActiveUserId(id: string) {
  localStorage.setItem(ACTIVE_USER_KEY, id)
}

export async function seedIfEmpty() {
  const existingCount = await db.items.count()
  const currentVersion = localStorage.getItem(SEED_VERSION_KEY)

  // Version the seed so the demo can be reset or refreshed deterministically while iterating.
  if (existingCount > 0 && currentVersion === SEED_VERSION) {
    return
  }

  await clearDatabase()

  const { locationEvents, actionEvents } = createSeedRecords()

  await db.transaction('rw', [db.users, db.locations, db.items, db.locationEvents, db.actionEvents], async () => {
    await db.users.bulkAdd(USERS)
    await db.locations.bulkAdd(LOCATIONS)
    await db.items.bulkAdd(ITEMS)
    await db.locationEvents.bulkAdd(locationEvents)
    await db.actionEvents.bulkAdd(actionEvents)
  })

  localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION)
}

export async function resetDemoData() {
  const preservedUserId = getActiveUserId()

  await clearDatabase()
  localStorage.removeItem(SEED_VERSION_KEY)
  await seedIfEmpty()

  if (preservedUserId) {
    setActiveUserId(preservedUserId)
  }
}

export async function getUsers() {
  await seedIfEmpty()
  return db.users.toArray()
}

export async function getLocations() {
  await seedIfEmpty()
  return db.locations.toArray()
}

export async function getAllItems(): Promise<DashboardItemView[]> {
  await seedIfEmpty()

  const [items, locations] = await Promise.all([db.items.toArray(), db.locations.toArray()])
  const locationsById = new Map(locations.map((location) => [location.id, location]))

  // Shape raw records into exactly what the dashboard table needs so the page stays simple.
  return items
    .sort((left, right) => left.id.localeCompare(right.id))
    .map((item) => ({
      id: item.id,
      name: item.name,
      solutionType: item.solutionType,
      solutionLabel: getSolutionLabel(item.solutionType),
      locationName: getLocationName(item.currentLocationId, locationsById),
      status: item.status,
    }))
}

export async function getItemDetail(itemId: string): Promise<ItemDetailView | null> {
  await seedIfEmpty()

  const [item, locations, users, locationHistory, actionHistory] = await Promise.all([
    db.items.get(itemId),
    db.locations.toArray(),
    db.users.toArray(),
    db.locationEvents.where('itemId').equals(itemId).toArray(),
    db.actionEvents.where('itemId').equals(itemId).toArray(),
  ])

  if (!item) {
    return null
  }

  const locationsById = new Map(locations.map((location) => [location.id, location]))
  const usersById = new Map(users.map((user) => [user.id, user]))

  // The detail page consumes a view model with resolved names and pre-sorted history rows.
  return {
    item: {
      ...item,
      solutionLabel: getSolutionLabel(item.solutionType),
      solutionTitle: getSolutionLabel(item.solutionType),
      currentLocationName: getLocationName(item.currentLocationId, locationsById),
      terminalActionLabel: getTerminalActionLabel(item.solutionType),
      terminalActionType: getTerminalActionType(item.solutionType),
      locationActionLabel: getLocationActionLabel(item.solutionType),
      locationActionType: getLocationActionType(item.solutionType),
    },
    locationHistory: locationHistory
      .sort((left, right) => right.timestamp.localeCompare(left.timestamp))
      .slice(0, 6)
      .map((event) => ({
        id: event.id,
        locationId: event.locationId,
        locationName: locationsById.get(event.locationId)?.name ?? 'Unknown',
        timestamp: event.timestamp,
      })),
    actionHistory: actionHistory
      .sort((left, right) => right.timestamp.localeCompare(left.timestamp))
      .slice(0, 6)
      .map((event) => ({
        id: event.id,
        userId: event.userId,
        userName: usersById.get(event.userId)?.name ?? 'Unknown user',
        actionLabel: getActionHistoryLabel(event.actionType),
        timestamp: event.timestamp,
      })),
  }
}

export async function applyAction(itemId: string, userId: string, actionType: ActionType, locationId?: string) {
  await seedIfEmpty()

  const item = await db.items.get(itemId)

  if (!item) {
    throw new Error('Item not found')
  }

  if (isLocationAction(actionType) && !locationId) {
    throw new Error('A location must be selected before submitting.')
  }

  const timestamp = new Date().toISOString()
  const nextStatus = getStatusFromAction(actionType)
  const nextLocationId = isLocationAction(actionType) ? locationId ?? null : null

  await db.transaction('rw', db.items, db.locationEvents, db.actionEvents, async () => {
    // Every action updates the item snapshot first so dashboard and detail reads stay consistent.
    await db.items.update(itemId, {
      status: nextStatus,
      currentLocationId: nextStatus === 'active' ? nextLocationId : null,
    })

    // Location actions write to both history tables and reactivate the item.
    if (isLocationAction(actionType) && nextLocationId) {
      await db.locationEvents.add({
        id: crypto.randomUUID(),
        itemId,
        locationId: nextLocationId,
        timestamp,
      })
    }

    // Terminal actions only append action history because the item's location becomes NA.
    await db.actionEvents.add({
      id: crypto.randomUUID(),
      itemId,
      userId,
      actionType,
      locationId: nextLocationId,
      timestamp,
    })
  })
}
