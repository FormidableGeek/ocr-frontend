'use client'

import { useAuth } from '@/hooks/auth'
import Navigation from '@/app/(app)/Navigation'
import Nav from '@/app/(app)/Nav'
import Loading from '@/app/(app)/Loading'

const AppLayout = ({ children }) => {
    const { user } = useAuth({ middleware: 'auth' })

    if (!user) {
        return <Loading />
    }

    /* return (
    //     <div className="min-h-screen bg-gray-100">
    //         <Navigation user={user} />

    //         
    //     </div>
    // )*/

    return (
        <div className="relative flex size-full min-h-screen flex-col bg-neutral-50 group/design-root overflow-x-hidden" style={
        {'font-family': 'Inter'}
        }>
            <div className="layout-container flex h-full grow flex-col">
                 <div className="gap-1 px-6 flex   py-5">
                    <Nav></Nav>
                    <main >{children}</main>
                </div>
            </div>

        </div>
    )
}

export default AppLayout
