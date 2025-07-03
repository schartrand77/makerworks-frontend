import PageLayout from '@/components/layout/PageLayout'

const NotFound: React.FC = () => {
  return (
    <PageLayout title="404 – Page Not Found">
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold mb-2">Oops!</h1>
        <p className="text-lg text-muted-foreground">
          We couldn't find the page you're looking for.
        </p>
      </div>
    </PageLayout>
  )
}

export default NotFound
