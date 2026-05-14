import 'package:flutter/material.dart';

class SliverAppBarScreen extends StatelessWidget {
  const SliverAppBarScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 200,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              title: const Text('SliverAppBar'),
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Colors.deepPurple, Colors.purple.shade300],
                  ),
                ),
                child: const Center(
                  child: Icon(
                    Icons.icecream,
                    size: 80,
                    color: Colors.white54,
                  ),
                ),
              ),
            ),
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) => ListTile(
                leading: CircleAvatar(child: Text('${index + 1}')),
                title: Text('Item ${index + 1}'),
              ),
              childCount: 20,
            ),
          ),
        ],
      ),
    );
  }
}

class SliverAppBarFloating extends StatelessWidget {
  const SliverAppBarFloating({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            floating: true,
            snap: true,
            title: const Text('Floating AppBar'),
            actions: [
              IconButton(
                icon: const Icon(Icons.search),
                onPressed: () {},
              ),
              IconButton(
                icon: const Icon(Icons.more_vert),
                onPressed: () {},
              ),
            ],
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) => Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                child: ListTile(
                  title: Text('Content Item ${index + 1}'),
                ),
              ),
              childCount: 30,
            ),
          ),
        ],
      ),
    );
  }
}

class SliverPinnedHeader extends StatelessWidget {
  const SliverPinnedHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 150,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              title: const Text('Pinned Header'),
            ),
          ),
          SliverPersistentHeader(
            pinned: true,
            delegate: _SliverHeaderDelegate(
              minHeight: 50,
              maxHeight: 50,
              child: Container(
                color: Colors.deepPurple,
                alignment: Alignment.center,
                child: const Text(
                  'Persistent Header',
                  style: TextStyle(color: Colors.white, fontSize: 18),
                ),
              ),
            ),
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) => ListTile(title: Text('List Item ${index + 1}')),
              childCount: 30,
            ),
          ),
        ],
      ),
    );
  }
}

class _SliverHeaderDelegate extends SliverPersistentHeaderDelegate {
  final double minHeight;
  final double maxHeight;
  final Widget child;

  _SliverHeaderDelegate({
    required this.minHeight,
    required this.maxHeight,
    required this.child,
  });

  @override
  double get minExtent => minHeight;

  @override
  double get maxExtent => maxHeight;

  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) {
    return SizedBox.expand(child: child);
  }

  @override
  bool shouldRebuild(_SliverHeaderDelegate oldDelegate) {
    return maxHeight != oldDelegate.maxHeight ||
        minHeight != oldDelegate.minHeight ||
        child != oldDelegate.child;
  }
}

class SliverAppBarWithTabs extends StatelessWidget {
  const SliverAppBarWithTabs({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        body: NestedScrollView(
          headerSliverBuilder: (context, innerBoxIsScrolled) {
            return [
              SliverAppBar(
                expandedHeight: 200,
                pinned: true,
                flexibleSpace: const FlexibleSpaceBar(title: Text('With Tabs')),
                bottom: const TabBar(
                  tabs: [
                    Tab(icon: Icon(Icons.home), text: 'Home'),
                    Tab(icon: Icon(Icons.search), text: 'Search'),
                    Tab(icon: Icon(Icons.person), text: 'Profile'),
                  ],
                ),
              ),
            ];
          },
          body: const TabBarView(
            children: [
              Center(child: Text('Home Content')),
              Center(child: Text('Search Content')),
              Center(child: Text('Profile Content')),
            ],
          ),
        ),
      ),
    );
  }
}