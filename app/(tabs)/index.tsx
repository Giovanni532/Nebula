import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { WalletSelector } from '@/components/wallet/WalletSelector';
import { AnimatedAmount } from '@/components/wallet/AnimatedAmount';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type WalletData = {
  address: string;
  balance: number;
  tokens: Token[];
};

type Token = {
  symbol: string;
  name: string;
  amount: string;
  dollarValue: number;
  change: string;
};

export default function WalletScreen() {
  const [isOpen, setIsOpen] = useState(false);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkWalletAndLoad();
  }, []);

  const checkWalletAndLoad = async () => {
    try {
      const walletAddress = await AsyncStorage.getItem('currentWallet');
      const hasWallet = await AsyncStorage.getItem('hasWallet');

      if (!hasWallet || !walletAddress) {
        router.replace('/welcome');
        return;
      }

      // TODO: Charger les données du wallet
      // Temporairement, on met des données de test
      setWalletData({
        address: walletAddress,
        balance: 245.8,
        tokens: [
          {
            symbol: "SOL",
            name: "Solana",
            amount: "245.8 SOL",
            dollarValue: 245.8,
            change: "+8.40%"
          }
        ]
      });
    } catch (error) {
      console.error('Erreur:', error);
      router.replace('/welcome');
    }
  };

  const getWalletName = (addressJson: string) => {
    try {
      const parsed = JSON.parse(addressJson);
      return parsed.name;
    } catch (error) {
      return 'Wallet';
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.dark.gradientStart, Colors.dark.gradientEnd]}
        style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.walletButton}
            onPress={() => setIsOpen(true)}
          >
            <Text style={styles.walletAddress}>
              {walletData?.address ? getWalletName(walletData.address) : ''}
            </Text>
            <FontAwesome5 name="chevron-down" size={12} color={Colors.dark.text} style={styles.walletIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <AnimatedAmount
            value={walletData?.balance ?? 0}
            precision={2}
            suffix=" $"
            style={styles.balanceAmount}
          />
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.mainButton}>
            <View style={styles.mainButtonInner}>
              <FontAwesome5 name="arrow-down" size={20} color={Colors.dark.text} />
            </View>
            <Text style={styles.mainButtonText}>Receive</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mainButton}>
            <View style={styles.mainButtonInner}>
              <FontAwesome5 name="plus" size={24} color={Colors.dark.text} />
            </View>
            <Text style={styles.mainButtonText}>Buy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mainButton}>
            <View style={styles.mainButtonInner}>
              <FontAwesome5 name="arrow-up" size={20} color={Colors.dark.text} />
            </View>
            <Text style={styles.mainButtonText}>Send</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.assetsContainer}>
          {walletData?.tokens.map((token, index) => (
            <AssetCard key={index} {...token} showChart={true} />
          ))}
        </ScrollView>
      </LinearGradient>

      <WalletSelector
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </View>
  );
}

function AssetCard({ symbol, name, amount, change, showChart }: { symbol: string, name: string, amount: string, change: string, showChart: boolean }) {
  return (
    <View style={styles.assetCard}>
      <View style={styles.assetInfo}>
        <View style={styles.assetIcon}>
          <Text style={styles.assetSymbol}>{symbol}</Text>
        </View>
        <View>
          <Text style={styles.assetName}>{name}</Text>
          <Text style={styles.assetAmount}>{amount}</Text>
        </View>
      </View>
      <View style={styles.assetChange}>
        <Text style={[styles.changeText, { color: Colors.dark.success }]}>
          {change}
        </Text>
      </View>
    </View>
  );
}

function WalletItem({ address, balance, isSelected }: { address: string, balance: string, isSelected: boolean }) {
  return (
    <TouchableOpacity
      style={[styles.walletItem, isSelected && styles.walletItemSelected]}
    >
      <View style={styles.walletItemLeft}>
        <Text style={styles.walletItemAddress}>{address}</Text>
        <Text style={styles.walletItemBalance}>{balance}</Text>
      </View>
      {isSelected && (
        <FontAwesome5 name="check" size={16} color={Colors.dark.primary} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 20 : 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  walletAddress: {
    color: Colors.dark.text,
    fontSize: 16,
    opacity: 0.8,
  },
  balanceContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  balanceLabel: {
    color: Colors.dark.secondaryText,
    fontSize: 16,
    marginBottom: 8,
  },
  balanceAmount: {
    color: Colors.dark.text,
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentageText: {
    color: Colors.dark.success,
    marginLeft: 4,
    fontSize: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 40,
  },
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButton: {
    alignItems: 'center',
  },
  mainButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.dark.text,
    marginTop: 8,
    fontSize: 12,
  },
  mainButtonText: {
    color: Colors.dark.text,
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  assetsContainer: {
    flex: 1,
    marginTop: 40,
    paddingHorizontal: 20,
  },
  assetCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  assetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  assetSymbol: {
    color: Colors.dark.text,
    fontWeight: 'bold',
  },
  assetName: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
  },
  assetAmount: {
    color: Colors.dark.secondaryText,
    fontSize: 14,
    marginTop: 4,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  assetChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  walletIcon: {
    marginLeft: 8,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 2,
  },
  modalTitle: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  walletList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  walletItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  walletItemSelected: {
    borderColor: Colors.dark.primary,
    borderWidth: 1,
  },
  walletItemLeft: {
    flex: 1,
  },
  walletItemAddress: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  walletItemBalance: {
    color: Colors.dark.secondaryText,
    fontSize: 14,
  },
});
