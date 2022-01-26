export const updateState = (oldState, props)=>{
    return{
        ...oldState,
        ...props
    }
}