import cn from 'classnames'
import React, { useState } from 'react'

import { useHasMounted } from '@/src/hooks/useHasMounted'
import { useTypedSelector } from '@/src/hooks/useTypedSelector'

import { HomeTypes } from './_types'
import styles from './Home.module.scss'

import UserCard from '../../UserCard/UserCard'

const Home: React.FC<HomeTypes> = ({ users }) => {
  const { user } = useTypedSelector((state) => state.user)
  const hasMounted = useHasMounted()

  const [filters, setFilters] = useState({
    minAge: '',
    maxAge: '',
    minHeight: '',
    maxWeight: '',
    city: '',
  })

  let filteredUsers = users || []

  if (user && user?.gender === 'male') {
    if (user?.gender) {
      filteredUsers = users?.filter((u) => u?.gender !== user?.gender)
    } else {
      filteredUsers = users?.filter((u) => u?.gender === 'female' && u?.id !== user?.id)
    }

    filteredUsers = filteredUsers?.filter((u) => {
      if (filters.minAge && u.age < parseInt(filters.minAge)) {
        return false
      }
      if (filters.maxAge && u.age > parseInt(filters.maxAge)) {
        return false
      }
      if (
        filters.minHeight &&
        u.PokewomanAttributes?.height &&
        u.PokewomanAttributes.height < parseInt(filters.minHeight)
      ) {
        return false
      }
      if (
        filters.maxWeight &&
        u.PokewomanAttributes?.weight &&
        u.PokewomanAttributes.weight > parseInt(filters.maxWeight)
      ) {
        return false
      }
      if (filters.city && u.city !== filters.city) {
        return false
      }
      return true
    })
  } else if (user && user?.gender === 'female') {
    filteredUsers = users?.filter((u) => {
      if (!u?.PokemanAttributes?.minPower) return
      if (!user?.PokewomanAttributes?.minDesiredPower) return
      return u.PokemanAttributes.minPower >= user.PokewomanAttributes.minDesiredPower
    })
  } else {
    filteredUsers = users?.filter((u) => u?.gender === 'female')
  }

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }))
  }

  if (!hasMounted) return null

  return (
    <section className={styles.wrapper}>
      <h1 className={styles.heading}>Найди свою любовь</h1>
      {user && user.gender === 'male' && (
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label htmlFor="minAgeFilter">возраст от:</label>
            <input
              min={18}
              type="number"
              id="minAgeFilter"
              value={filters.minAge}
              onChange={(e) => handleFilterChange('minAge', e.target.value)}
            />
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="maxAgeFilter">возраст до:</label>
            <input
              min={18}
              max={100}
              type="number"
              id="maxAgeFilter"
              value={filters.maxAge}
              onChange={(e) => handleFilterChange('maxAge', e.target.value)}
            />
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="minHeightFilter">рост от:</label>
            <input
              step={5}
              type="number"
              id="minHeightFilter"
              value={filters.minHeight}
              onChange={(e) => handleFilterChange('minHeight', e.target.value)}
            />
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="maxWeightFilter">вес до:</label>
            <input
              step={5}
              type="number"
              id="maxWeightFilter"
              value={filters.maxWeight}
              onChange={(e) => handleFilterChange('maxWeight', e.target.value)}
            />
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="cityFilter">город:</label>
            <select
              id="cityFilter"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            >
              <option value="">All cities</option>
              <option value="Moscow">Moscow</option>
              <option value="Ekaterinburg">Ekaterinburg</option>
              <option value="Novosibirsk">Novosibirsk</option>
              <option value="Kazan">Kazan</option>
            </select>
          </div>
        </div>
      )}
      {filteredUsers?.length > 0 ? (
        <ul className={styles.usersList}>
          {filteredUsers?.map((user) => {
            return (
              <li key={user.id}>
                <UserCard {...user}></UserCard>
              </li>
            )
          })}
        </ul>
      ) : (
        <p>
          По вашему запросу пока нет пользователей, попробуйте изменить фильтры или изменить данные
          о доходе мужчины
        </p>
      )}
    </section>
  )
}

export default React.memo(Home)
