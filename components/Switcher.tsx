import { Dispatch, SetStateAction } from "react"

const Switcher = ({isLimit,setIsLimit}:{isLimit: boolean,setIsLimit:Dispatch<SetStateAction<boolean>>}) => {

    const handleCheckboxChange = () => {
        setIsLimit(!isLimit)
    }

    return (
        <>
            <label className='flex cursor-pointer select-none items-center'>
                <div className='relative'>
                    <input
                        type='checkbox'
                        checked={isLimit}
                        onChange={handleCheckboxChange}
                        className='sr-only'
                    />
                    <div
                        className={`box block h-8 w-14 rounded-full ${
                            isLimit ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                    ></div>
                    <div
                        className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                            isLimit ? 'translate-x-full' : ''
                        }`}
                    ></div>
                </div>
            </label>
        </>
    )
}

export default Switcher
