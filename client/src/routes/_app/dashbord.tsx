import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/dashbord')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/dashbord"!</div>
}
