import { View, Text, StyleSheet, Platform, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function WalletScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.dark.gradientStart, Colors.dark.gradientEnd]}
        style={styles.gradient}>
        <View style={styles.header}>
          <Text style={styles.walletAddress}>0x2930...3904</Text>
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Current Wallet Balance</Text>
          <Text style={styles.balanceAmount}>$12,490.20</Text>
          <View style={styles.percentageContainer}>
            <FontAwesome5 name="arrow-up" size={12} color={Colors.dark.success} />
            <Text style={styles.percentageText}>12.55%</Text>
          </View>
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
          <AssetCard
            symbol="BTC"
            name="Bitcoin"
            amount="$12,490.20"
            change="+8.40%"
            showChart
          />
          <AssetCard
            symbol="ETH"
            name="Ethereum"
            amount="$490.20"
            change="+8.40%"
            showChart
          />
          <AssetCard
            symbol="TET"
            name="Tether"
            amount="$3,430.20"
            change="+8.40%"
            showChart
          />
        </ScrollView>
      </LinearGradient>
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
});
