/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = role => {
  if (role === 'student') return '/home'
  else return '/dashboard'
}

export default getHomeRoute
