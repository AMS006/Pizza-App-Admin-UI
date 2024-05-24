import { GridLoader } from 'react-spinners'
const Loader = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
            <GridLoader color='#f97316' size={20} />
        </div>
    )
}

export default Loader
