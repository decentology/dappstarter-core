import DappState from 0x0  

script {

    pub fun main() : [String] {
        return DappState.proposalList();
    }

}