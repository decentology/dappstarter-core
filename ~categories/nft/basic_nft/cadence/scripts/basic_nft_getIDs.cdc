
pub fun main(account) : [UInt64]? {
    let account = getAccount(account)
    let capability = account.getCapability(/public/NFTReceiver)
    let ref = capability!.borrow<&DappState.Collection>()

    return ref?.getIDs()
}